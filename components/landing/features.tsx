import { ClipboardCheck, LifeBuoy, Smile, ShieldAlert, Users, LineChart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const STUDENT_FEATURES = [
  {
    icon: ClipboardCheck,
    title: 'Khảo sát định kỳ',
    desc: 'Bài đánh giá tâm lý nhanh theo thang đo PHQ-9 / GAD-7, thực hiện hằng tháng chỉ trong vài phút.',
  },
  {
    icon: LifeBuoy,
    title: 'Nút báo động SOS',
    desc: 'Gửi tín hiệu trợ giúp khẩn cấp chỉ với một chạm, kết nối trực tiếp tới chuyên viên tư vấn.',
  },
  {
    icon: Smile,
    title: 'Nhật ký cảm xúc',
    desc: 'Ghi lại tâm trạng mỗi ngày kèm ghi chú ngắn để hiểu rõ hơn xu hướng cảm xúc của mình.',
  },
]

const COUNSELOR_FEATURES = [
  {
    icon: ShieldAlert,
    title: 'Phân loại rủi ro tự động',
    desc: 'Hệ thống xếp hạng học sinh theo 3 cấp độ: Bình thường, Cần tham vấn và Báo động đỏ.',
  },
  {
    icon: Users,
    title: 'Theo dõi ca tham vấn',
    desc: 'Quản lý tiến trình hỗ trợ và lưu nhật ký tham vấn riêng tư cho từng học sinh.',
  },
  {
    icon: LineChart,
    title: 'Thống kê diện rộng',
    desc: 'Biểu đồ tỷ lệ bao phủ tham vấn và xu hướng sức khỏe tinh thần theo từng lớp, khối.',
  },
]

function FeatureGrid({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string
  title: string
  items: { icon: typeof Smile; title: string; desc: string }[]
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold uppercase tracking-wide text-primary">{eyebrow}</span>
        <h3 className="font-heading text-2xl font-bold text-foreground">{title}</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((f) => (
          <Card key={f.title} className="border-border/70 transition-shadow hover:shadow-md">
            <CardHeader>
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <f.icon className="size-5" />
              </span>
              <CardTitle className="mt-3 font-heading text-lg">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">{f.desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function Features() {
  return (
    <section className="bg-card/40 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4">
        <FeatureGrid
          eyebrow="Dành cho học sinh"
          title="Chăm sóc bản thân mỗi ngày"
          items={STUDENT_FEATURES}
        />
        <FeatureGrid
          eyebrow="Dành cho chuyên viên & nhà trường"
          title="Đồng hành kịp thời với từng em"
          items={COUNSELOR_FEATURES}
        />
      </div>
    </section>
  )
}
