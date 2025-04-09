// // app/api/v1/payment/failed/route.ts
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams;
//   const orderId = searchParams.get("orderId");
//   const message = searchParams.get("message");

//   // If no orderId, redirect to a generic error page with message
//   if (!orderId) {
//     return NextResponse.redirect(
//       new URL(
//         `/api/v1/payment/failed?orderId=&message=${encodeURIComponent("No order ID provided")}`,
//         request.url,
//       ),
//     );
//   }

//   // Redirect to failed page with orderId and message, maintaining API consistency
//   return NextResponse.redirect(
//     new URL(
//       `/api/v1/payment/failed?orderId=${orderId}&message=${encodeURIComponent(message || "Unknown error")}`,
//       request.url,
//     ),
//   );
// }

// src/app/api/v1/payment/failed/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");

  return NextResponse.redirect(
    new URL(
      `/payment/failed?orderId=${orderId || ""}&message=${encodeURIComponent(message || "Lỗi không xác định")}`,
      request.url,
    ),
  );
}
