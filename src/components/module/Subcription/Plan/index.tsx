import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import subscriptionPlans from '@/types/subcription-plan';
import { Bell, DollarSign, MessageSquareQuote } from 'lucide-react'
import React from 'react'

export const SubcriptionPlanModule = () => {

    const activePlans = subscriptionPlans.filter((plan) => plan.isActive);
      // Hàm format ngày
  const getFormattedDate = (daysToAdd: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return `${date.getDate()} thg ${date.getMonth() + 1}`;
  };
    
  return (
    <div className="bg-[#0b0b23] text-white py-16 px-4 text-center mt-12 rounded-lg">
        {/* Pricing Subscription */}
        <h2 className="text-3xl font-bold">TECHNIHONGO</h2>
        <p className="text-lg mt-2">Đạt điểm cao hơn với nền tảng học tiếng Nhật chuyên ngành số 1 FPT</p>
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {activePlans.map((plan) => (
            <Card key={plan.id} className="bg-white text-black p-6 w-72">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-gray-600 mt-2">Duration: {plan.durationDays} days</p>
              <p className="text-2xl font-bold mt-2">${plan.price}</p>
              <Button className="bg-blue-500 text-white mt-4 w-full">Subscribe</Button>
            </Card>
          ))}
        </div>
        <div className="mt-16"></div>

        {/* Trial Info Section */}
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold mb-2">Cách hoạt động của các gói Premium TechNihongo*</h3>
          <p className="text-sm text-gray-400">*Gói dịch vụ hàng tháng không có dùng thử miễn phí</p>
        </div>

        {/* Timeline */}
        <div className="relative mt-12">
          {/* Timeline line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-700"></div>
          {/* Timeline steps */}
          <div className="flex justify-between relative">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center w-1/3">
              <div className="bg-gray-800 p-3 rounded-full z-10 mb-4">
                <MessageSquareQuote className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="text-sm font-bold mb-2">Hôm nay: Truy cập tức thì</h4>
              <p className="text-xs text-gray-400 text-center">Truy cập những nội dung dùng thử Premium khi bạn đăng ký sử dụng một gói dịch vụ hàng năm.</p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center w-1/3">
              <div className="bg-gray-800 p-3 rounded-full z-10 mb-4">
                <Bell className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="text-sm font-bold mb-2">{getFormattedDate(7)}: Lời nhắc – thời gian dùng thử của bạn sắp kết thúc</h4>
              <p className="text-xs text-gray-400 text-center">Bạn sẽ nhận được một email. Hủy bất cứ lúc nào trước ngày gia hạn để tránh bị tính phí.</p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center w-1/3">
              <div className="bg-gray-800 p-3 rounded-full z-10 mb-4">
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="text-sm font-bold mb-2">{getFormattedDate(10)}: Thời gian dùng thử kết thúc và gói dịch vụ hàng năm bắt đầu</h4>
              <p className="text-xs text-gray-400 text-center">Bạn sẽ được tự động tính phí cho một năm dịch vụ và những năm tiếp theo trừ khi bạn hủy.</p>
            </div>
          </div>
        </div>
      </div>
  )
}
