// /* eslint-disable prettier/prettier */
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams;
//   const subPlanId = searchParams.get("subPlanId");
//   const orderId = searchParams.get("orderId");

//   // If no subPlanId is provided but we have an orderId
//   if (!subPlanId && orderId) {
//     return NextResponse.redirect(
//       new URL(`/api/v1/payment/success?orderId=${orderId}`, request.url)
//     );
//   }

//   // If no subPlanId and no orderId, redirect to failed with error message
//   if (!subPlanId) {
//     return NextResponse.redirect(
//       new URL(
//         `/api/v1/payment/failed?orderId=${orderId || ""}&message=${encodeURIComponent("Missing subscription plan ID")}`,
//         request.url
//       )
//     );
//   }

//   // Successful case with both subPlanId and orderId
//   return NextResponse.redirect(
//     new URL(
//       `/api/v1/payment/success?orderId=${orderId || ""}`,
//       request.url
//     )
//   );
// }

// app/api/v1/payment/success/route.ts
// src/app/api/v1/payment/success/route.ts
//=================================================================
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams;
//   const orderId = searchParams.get("orderId");

//   if (!orderId) {
//     return NextResponse.redirect(
//       new URL(
//         `/api/v1/payment/failed?orderId=&message=${encodeURIComponent("Thiếu ID đơn hàng")}`,
//         request.url,
//       ),
//     );
//   }

//   return NextResponse.redirect(
//     new URL(`/payment/success?orderId=${orderId}`, request.url),
//   );
// }
//========================================================================================
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.redirect(
      new URL(
        `/payment/failed?message=${encodeURIComponent("Thiếu ID đơn hàng")}`,
        request.nextUrl.origin,
      ),
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payment/success?orderId=${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Backend responded with status ${res.status}`);
    }

    return NextResponse.redirect(
      new URL(`/payment/success?orderId=${orderId}`, request.nextUrl.origin),
    );
  } catch (error: any) {
    console.error("Error calling backend API:", error);

    return NextResponse.redirect(
      new URL(
        `/payment/failed?orderId=${orderId}&message=${encodeURIComponent("Không thể tạo giao dịch: " + error.message)}`,
        request.nextUrl.origin,
      ),
    );
  }
}
