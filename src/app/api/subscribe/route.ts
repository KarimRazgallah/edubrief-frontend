import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import client from "@sendgrid/client";

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
client.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Add contact to SendGrid marketing list
    const listId = process.env.SENDGRID_LIST_ID;

    if (listId) {
      // Use SendGrid client to add the contact to the list
      const data = {
        contacts: [
          {
            email: email,
            custom_fields: {
              // You can add custom fields here if needed
              // e.g. w1: 'Subscriber from website'
            },
          },
        ],
        list_ids: [listId],
      };

      await client.request({
        method: "PUT",
        url: "/v3/marketing/contacts",
        body: data,
      });
    }

    // Send confirmation email
    const confirmationMsg = {
      to: email,
      from: process.env.FROM_EMAIL || "noreply@edubrief.com",
      subject: "Welcome to the EduBrief Newsletter!",
      text: `
        Thank you for subscribing to the EduBrief newsletter!
        
        You'll now receive updates on new courses, blog posts, and educational resources.
        
        If you didn't sign up for this newsletter, please disregard this email.
        
        Best regards,
        The EduBrief Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #EBF5FF; padding: 20px; text-align: center;">
            <h1 style="color: #1E40AF;">Welcome to the EduBrief Newsletter!</h1>
          </div>
          <div style="padding: 20px;">
            <p>Thank you for subscribing to the EduBrief newsletter!</p>
            <p>You'll now receive updates on:</p>
            <ul>
              <li>New courses and learning paths</li>
              <li>Insightful blog posts from our instructors</li>
              <li>Educational tips and resources</li>
              <li>Special promotions and events</li>
            </ul>
            <p>If you didn't sign up for this newsletter, please disregard this email.</p>
            <p>Best regards,<br>The EduBrief Team</p>
          </div>
          <div style="background-color: #F3F4F6; padding: 15px; text-align: center; font-size: 12px; color: #6B7280;">
            <p>To unsubscribe or manage your preferences, click <a href="#" style="color: #3B82F6;">here</a>.</p>
          </div>
        </div>
      `,
    };

    await sgMail.send(confirmationMsg);

    return NextResponse.json({
      message: "Successfully subscribed to the newsletter",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return NextResponse.json(
      { message: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
