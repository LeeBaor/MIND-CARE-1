// Shared types and DASS-21 scoring used by both student and counselor views.
export type RiskStatus = 'NORMAL' | 'NEED_HELP' | 'SEVERE'
export type AssessmentStatus = 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE' | 'EXTREMELY_SEVERE'

export interface Student { id: string; name: string; grade: string; riskScore: number; status: RiskStatus; lastCheckIn: string; createdAt: string }
export interface Assessment { id: string; studentId: string; totalScore: number; status: AssessmentStatus; month: number; createdAt: string }
export interface CaseHistory { id: string; studentId: string; author: string; notes: string; isUrgent: boolean; createdAt: string }
export interface MoodEntry { date: string; mood: number; note?: string }

export const RISK_META: Record<RiskStatus, { label: string; short: string; badge: string; dot: string; description: string }> = {
  NORMAL: { label: 'Bình thường / Nhẹ', short: 'THEO DÕI', badge: 'bg-success/15 text-success border-success/30', dot: 'bg-success', description: 'Có thể sử dụng tài liệu tự chăm sóc và Góc sẻ chia. Hệ thống sẽ nhắc làm lại bài đánh giá định kỳ.' },
  NEED_HELP: { label: 'Cần tham vấn', short: 'ƯU TIÊN', badge: 'bg-warning/20 text-warning-foreground border-warning/40', dot: 'bg-warning', description: 'Hệ thống khuyến nghị đăng ký lịch hẹn trực tiếp với chuyên gia tâm lý.' },
  SEVERE: { label: 'Cảnh báo đỏ', short: 'KHẨN CẤP', badge: 'bg-danger/15 text-danger border-danger/30', dot: 'bg-danger', description: 'Cần được chuyên gia tiếp nhận ngay. Tín hiệu cảnh báo đã được đẩy đến Dashboard.' },
}

export const ASSESSMENT_OPTIONS = [
  { label: 'Không đúng với em', value: 0 }, { label: 'Đúng với em phần nào', value: 1 },
  { label: 'Đúng với em khá nhiều', value: 2 }, { label: 'Hoàn toàn đúng với em', value: 3 },
]
export interface AssessmentQuestion { id: number; text: string; domain: 'D' | 'A' | 'S' }

// Vietnamese DASS-21 items. Scores are doubled when compared with DASS-42 cut-offs.
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  { id: 1, domain: 'S', text: 'Em thấy khó thư giãn.' },
  { id: 2, domain: 'A', text: 'Em nhận ra miệng mình bị khô.' },
  { id: 3, domain: 'D', text: 'Em dường như không có cảm xúc tích cực.' },
  { id: 4, domain: 'A', text: 'Em thấy khó thở (ví dụ thở nhanh, hụt hơi khi không vận động).' },
  { id: 5, domain: 'D', text: 'Em thấy khó bắt tay vào công việc.' },
  { id: 6, domain: 'S', text: 'Em có xu hướng phản ứng quá mức với tình huống.' },
  { id: 7, domain: 'A', text: 'Em thấy run rẩy (ví dụ ở tay).' },
  { id: 8, domain: 'S', text: 'Em cảm thấy đang dùng nhiều năng lượng thần kinh.' },
  { id: 9, domain: 'A', text: 'Em lo lắng về các tình huống có thể làm mình hoảng sợ hoặc mất mặt.' },
  { id: 10, domain: 'D', text: 'Em thấy mình không có gì để mong đợi.' },
  { id: 11, domain: 'S', text: 'Em thấy mình dễ bị kích động.' },
  { id: 12, domain: 'S', text: 'Em thấy khó thả lỏng.' },
  { id: 13, domain: 'D', text: 'Em cảm thấy buồn chán, chán nản.' },
  { id: 14, domain: 'S', text: 'Em không chịu được việc có điều gì cản trở công việc đang làm.' },
  { id: 15, domain: 'A', text: 'Em cảm thấy gần như hoảng loạn.' },
  { id: 16, domain: 'D', text: 'Em không thể nhiệt tình với bất cứ việc gì.' },
  { id: 17, domain: 'D', text: 'Em cảm thấy mình không đáng là một người có giá trị.' },
  { id: 18, domain: 'S', text: 'Em thấy mình khá dễ phật ý, tự ái.' },
  { id: 19, domain: 'A', text: 'Em nhận thấy tim mình đập nhanh dù không vận động.' },
  { id: 20, domain: 'A', text: 'Em thấy sợ hãi vô cớ.' },
  { id: 21, domain: 'D', text: 'Em thấy cuộc sống vô nghĩa.' },
]

export interface DassResult { status: AssessmentStatus; risk: RiskStatus; advice: string; total: number; depression: number; anxiety: number; stress: number; route: 1 | 2 | 3 }

function severity(score: number, cutoffs: number[]): AssessmentStatus {
  if (score <= cutoffs[0]) return 'NORMAL'
  if (score <= cutoffs[1]) return 'MILD'
  if (score <= cutoffs[2]) return 'MODERATE'
  if (score <= cutoffs[3]) return 'SEVERE'
  return 'EXTREMELY_SEVERE'
}

export function classifyDass(answers: Record<number, number>): DassResult {
  const raw = { D: 0, A: 0, S: 0 }
  ASSESSMENT_QUESTIONS.forEach((q) => { raw[q.domain] += answers[q.id] ?? 0 })
  const depression = raw.D * 2, anxiety = raw.A * 2, stress = raw.S * 2
  const levels = [severity(depression, [9, 13, 20, 27]), severity(anxiety, [7, 9, 14, 19]), severity(stress, [14, 18, 25, 33])]
  const rank: Record<AssessmentStatus, number> = { NORMAL: 0, MILD: 1, MODERATE: 2, SEVERE: 3, EXTREMELY_SEVERE: 4 }
  const status = levels.reduce((worst, item) => rank[item] > rank[worst] ? item : worst, 'NORMAL' as AssessmentStatus)
  const total = depression + anxiety + stress
  if (rank[status] >= 4) return { status, risk: 'SEVERE', route: 3, total, depression, anxiety, stress, advice: 'Kết quả cho thấy em đang có mức nguy cơ rất cao. Chuyên gia đã nhận cảnh báo ưu tiên; nếu em không an toàn, hãy bấm SOS hoặc gọi 111 ngay.' }
  if (rank[status] >= 2) return { status, risk: 'NEED_HELP', route: 2, total, depression, anxiety, stress, advice: 'Em nên đặt lịch tham vấn 1-1 với chuyên gia. Đây là không gian riêng tư để cùng tìm phương án hỗ trợ phù hợp.' }
  return { status, risk: 'NORMAL', route: 1, total, depression, anxiety, stress, advice: 'Em có thể tiếp tục tự chăm sóc: xem tài liệu và tham gia Góc sẻ chia bằng ID ẩn danh.' }
}

// Backward-compatible helper for the dashboard demo.
export function classifyScore(total: number) { return classifyDass(Object.fromEntries(ASSESSMENT_QUESTIONS.map((q, i) => [q.id, i < 7 ? Math.min(3, Math.floor(total / 7)) : 0]))) }

export const STUDENTS: Student[] = []
export const ASSESSMENTS: Assessment[] = []
export const CASE_HISTORIES: CaseHistory[] = []
export const MOOD_HISTORY: MoodEntry[] = []
export const MOODS = [{ value: 5, label: 'Rất vui', emoji: '😀' }, { value: 4, label: 'Vui', emoji: '🙂' }, { value: 3, label: 'Bình thường', emoji: '😐' }, { value: 2, label: 'Buồn', emoji: '😔' }, { value: 1, label: 'Rất tệ', emoji: '😢' }]
export const COVERAGE_BY_GRADE: { grade: string; surveyed: number; total: number }[] = []
export const MONTHLY_TREND: { month: string; normal: number; needHelp: number; severe: number }[] = []
export function getStudent(id: string) { return STUDENTS.find((s) => s.id === id) }
export function getAssessments(studentId: string) { return ASSESSMENTS.filter((a) => a.studentId === studentId) }
export function getCaseHistories(studentId: string) { return CASE_HISTORIES.filter((c) => c.studentId === studentId) }
