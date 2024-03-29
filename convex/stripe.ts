import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action, internalAction } from "./_generated/server";
import Stripe from "stripe";

type Metadata = {
  userId: string;
};

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, args) => {
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2023-10-16",
    });

    const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET!;
    try {
      const event = await stripe.webhooks.constructEventAsync(
        args.payload,
        args.signature,
        webhookSecret
      );

      const completedEvent = event.data.object as Stripe.Checkout.Session & {
        metadata: Metadata;
      };

      if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
          completedEvent.subscription as string
        );

        const userId = completedEvent.metadata.userId as Id<"users">;

        await ctx.runMutation(internal.users.updateSubscription, {
          userId,
          subscriptionId: completedEvent.id,
          endsOn: subscription.current_period_end * 1000,
        });
      }

      if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
          completedEvent.subscription as string
        );

        await ctx.runMutation(internal.users.updateSubscriptionBySubId, {
          subscriptionId: completedEvent.id,
          endsOn: subscription.current_period_end * 1000,
        });
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});

export const pay = action({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("You must be logged in to subscribe");
    }

    if (!user.emailVerified) {
      throw new Error("You must have a verified email to subscribe");
    }

    const domain = process.env.HOSTING_URL ?? "http://localhost:3000";
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2023-10-16",
    });
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: process.env.PRICE_ID!, quantity: 1 }],
      customer_email: user.email,
      metadata: {
        userId: user.subject,
      },
      currency: "USD",
      mode: "subscription",
      success_url: `${domain}`,
      cancel_url: `${domain}`,
    });

    return session.url!;
  },
});
