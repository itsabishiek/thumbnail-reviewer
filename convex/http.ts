import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/stripe",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const signature = req.headers.get("stripe-signature") as string;

    const result = await ctx.runAction(internal.stripe.fulfill, {
      payload: await req.text(),
      signature,
    });

    if (result.success) {
      return new Response(null, {
        status: 200,
      });
    } else {
      return new Response("Stripe Webhook Error", {
        status: 400,
      });
    }
  }),
});

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const payloadString = await req.text();
    const headerPayload = req.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfil, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            userId: result.data.id,
            email: result.data.email_addresses[0]?.email_address,
            name: `${result.data.first_name} ${result.data.last_name}`,
            profileImage: result.data.image_url,
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return new Response("Clerk Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;
