"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import "./globals.css"
import Link from "next/link"

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible] as const
}

function Reveal({ children, delay = "" }: { children: React.ReactNode, delay?: string }) {
  const [ref, visible] = useInView()
  return (
    <div ref={ref} className={`reveal ${delay} ${visible ? "in" : ""}`.trim()}>
      {children}
    </div>
  )
}

function Navbar() {
  return (
    <nav className="nav">
      <Image src="/download.svg" alt="Logo" className="nav-logo" width={130} height={100} />
      <ul className="nav-links">
        {[
          { label: "Tính năng", href: "#tinh-nang" },
          { label: "Báo cáo",   href: "#bao-cao"   },
          { label: "Bảng giá",  href: "#bang-gia"  },
          { label: "Hỗ trợ",    href: "#ho-tro"    },
        ].map(l => (
          <li key={l.label}><a href={l.href}>{l.label}</a></li>
        ))}
      </ul>
      <div className="nav-actions">
        <Link href="/signin">
          <button className="btn-ghost">Đăng nhập</button>
        </Link>
        <Link href="/signup">
          <button className="btn-dark">Đăng ký</button>
        </Link>
      </div>
    </nav>
  )
}

function AppPreview() {
  const stats = [
    { icon:"💳", cls:"ic-g", badge:"+12.5%", up:true,  label:"Tổng Số Dư",  val:"45,230,000 đ" },
    { icon:"📈", cls:"ic-b", badge:"+4.2%",  up:true,  label:"Thu Nhập",    val:"28,500,000 đ" },
    { icon:"💸", cls:"ic-r", badge:"-2.1%",  up:false, label:"Đã Chi Tiêu", val:"12,450,000 đ" },
  ]
  return (
    <div className="app-wrapper">
      <div className="app-window">
        <div className="win-bar">
          <div className="win-dots">
            <div className="dot dot-r"/><div className="dot dot-y"/><div className="dot dot-g"/>
          </div>
          <div className="win-url">app.smartbudget.vn</div>
        </div>
        <div className="app-body">
          <div className="sidebar">
            {[["⊞","Tổng quan"],["↗","Giao dịch"],["◎","Ngân sách"],["↘","Báo cáo"]].map(([icon,label],i) => (
              <div key={label} className={`s-item${i===0?" active":""}`}><span>{icon}</span>{label}</div>
            ))}
          </div>
          <div className="main">
            <div className="main-hdr">
              <div>
                <div className="main-title">Tổng quan tài chính</div>
                <div className="main-sub">Tháng này, bạn đã chi tiêu hợp lý.</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{color:"#9CA3AF",fontSize:18}}>🔔</span>
                <div className="avatar">SB</div>
              </div>
            </div>
            <div className="stat-grid">
              {stats.map(s => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-top">
                    <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                    <span className={`sbadge ${s.up?"up":"dn"}`}>{s.badge}</span>
                  </div>
                  <div className="stat-lbl">{s.label}</div>
                  <div className="stat-val">{s.val}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:13,fontWeight:600,paddingTop:8}}>Thống kê Thu/Chi</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-content">
       
        <h1>Kiểm soát tài chính<br/><span className="grad-text">trong tầm tay bạn</span></h1>
        <p className="hero-sub">Nền tảng quản lý chi tiêu cá nhân hiện đại giúp bạn theo dõi thu chi, lập ngân sách thông minh và đạt được mục tiêu tài chính nhanh chóng.</p>
        <div className="hero-btns">
        <Link href="/signin">
          <button className="btn-cta">Bắt đầu ngay</button>
        </Link>
          <button className="btn-outline">Tìm hiểu thêm</button>
        </div>
      </div>
      <AppPreview/>
    </section>
  )
}

function Features() {
  const feats = [
    {icon:"📊",cls:"fi-p",title:"Phân tích chi tiết",desc:"Nhận báo cáo trực quan về thói quen chi tiêu của bạn thông qua các biểu đồ sinh động và dễ hiểu."},
    {icon:"🛡️",cls:"fi-g",title:"Bảo mật tuyệt đối",desc:"Dữ liệu tài chính của bạn được mã hóa an toàn ở cấp độ ngân hàng, đảm bảo sự riêng tư tuyệt đối."},
    {icon:"⚡",cls:"fi-y",title:"Tốc độ siêu tốc",desc:"Thêm giao dịch mới chỉ trong vài giây. Trải nghiệm mượt mà trên mọi thiết bị của bạn."},
  ]
  return (
    <section className="section" id="tinh-nang" style={{background:"#fff",textAlign:"center"}}>
      <Reveal><h2 className="sec-title">Mọi thứ bạn cần để làm chủ tài chính</h2></Reveal>
      <Reveal delay="d1"><p className="sec-sub">SmartBudget mang đến bộ công cụ hoàn chỉnh, từ theo dõi chi tiêu hàng ngày đến lập kế hoạch tài chính dài hạn.</p></Reveal>
      <div className="feat-grid">
        {feats.map((f,i) => (
          <Reveal key={f.title} delay={`d${i+1}`}>
            <div className="feat-card">
              <div className={`feat-icon ${f.cls}`}>{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <p className="feat-desc">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Report() {
  const spends = [
    {label:"Ăn uống",amt:"4,500,000 đ",pct:"78%",color:"#EF4444"},
    {label:"Hóa đơn & Tiện ích",amt:"3,450,000 đ",pct:"55%",color:"#10B981"},
    {label:"Di chuyển",amt:"1,200,000 đ",pct:"30%",color:"#F59E0B"},
    {label:"Giải trí",amt:"850,000 đ",pct:"20%",color:"#6C4FE8"},
  ]
  return (
    <section className="section report-sec" id ="bao-cao">
      <div className="report-inner">
        <Reveal>
          <div>
            <div className="rpt-badge">📈 Báo cáo thông minh</div>
            <h2 className="rpt-title">Thấu hiểu dòng tiền<br/>với báo cáo trực quan</h2>
            <p className="rpt-desc">SmartBudget tự động phân loại giao dịch và tổng hợp thành các biểu đồ sinh động.</p>
            <ul className="check-list">
              {["Phân tích thu chi chi tiết theo từng danh mục","Dự báo chi tiêu tháng tới dựa trên lịch sử","Xuất báo cáo PDF & Excel chuyên nghiệp"].map(c => (
                <li key={c}><div className="chk">✓</div>{c}</li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay="d1">
          <div className="spend-card">
            <div className="spend-title">Cơ cấu chi tiêu tháng này</div>
            {spends.map(s => (
              <div className="spend-row" key={s.label}>
                <div className="spend-lbl-row">
                  <span className="spend-lbl">{s.label}</span>
                  <span className="spend-amt">{s.amt}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{width:s.pct,background:s.color}}/>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Pricing() {
  const freeF = ["Quản lý 1 ví/tài khoản","Báo cáo thu chi cơ bản","Thiết lập tối đa 2 mục tiêu"]
  const premF = ["Quản lý không giới hạn ví","Báo cáo & phân tích chuyên sâu AI","Không giới hạn mục tiêu","Chia sẻ sổ thu chi với gia đình"]
  return (
    <section className="section" id = " bang-gia" style={{background:"#fff",textAlign:"center"}}>
      <Reveal><h2 className="sec-title">Bảng giá đơn giản, minh bạch</h2></Reveal>
      <Reveal delay="d1"><p className="sec-sub">Không phí ẩn, hủy bất cứ lúc nào.</p></Reveal>
      <div className="pricing-grid">
        <Reveal>
          <div className="price-card">
            <div className="plan-name">Cơ bản</div>
            <div className="plan-desc">Dành cho cá nhân mới bắt đầu quản lý chi tiêu</div>
            <div className="price-val">0 <span style={{fontSize:22}}>đ</span></div>
            <div className="price-unit">/tháng</div>
            <ul className="plan-features">
              {freeF.map(f => <li key={f}><div className="plan-chk">✓</div>{f}</li>)}
            </ul>
            <button className="btn-free">Bắt đầu miễn phí</button>
          </div>
        </Reveal>
        <Reveal delay="d1">
          <div className="price-card premium">
            <div className="popular-badge">PHỔ BIẾN NHẤT</div>
            <div className="plan-name">Premium</div>
            <div className="plan-desc">Công cụ mạnh mẽ để kiểm soát tài chính toàn diện</div>
            <div className="price-val">49.000 <span style={{fontSize:22}}>đ</span></div>
            <div className="price-unit">/tháng</div>
            <ul className="plan-features">
              {premF.map(f => <li key={f}><div className="plan-chk">✓</div>{f}</li>)}
            </ul>
            <button className="btn-premium">Nâng cấp Premium</button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Support() {
  const channels = [
    {icon:"✉️",title:"Gửi Email",sub:"support@smartbudget.vn"},
    {icon:"📞",title:"Hotline CSKH",sub:"1900 8888 (8h – 22h)"},
    {icon:"💬",title:"Chat trực tuyến",sub:"Phản hồi trong 5 phút"},
  ]
  return (
    <section className="section support-sec" id="ho-tro">
      <Reveal>
        <div className="support-icon-wrap">❓</div>
        <h2 className="sec-title">Bạn cần hỗ trợ?</h2>
        <p className="sec-sub">Đội ngũ SmartBudget luôn sẵn sàng giải đáp mọi thắc mắc 24/7.</p>
      </Reveal>
      <div className="support-grid">
        {channels.map((c,i) => (
          <Reveal key={c.title} delay={`d${i+1}`}>
            <div className="support-card">
              <div className="sup-icon">{c.icon}</div>
              <div className="sup-title">{c.title}</div>
              <div className="sup-sub">{c.sub}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="cta-sec">
      <Reveal>
        <h2 className="cta-title">Bắt đầu hành trình<br/><span className="grad-text">tự do tài chính</span> ngay hôm nay</h2>
        <p className="cta-sub">Miễn phí 30 ngày. Không cần thẻ tín dụng. Hủy bất cứ lúc nào.</p>
        <div className="cta-btns">
          <button className="btn-white">Bắt đầu miễn phí →</button>
          <button className="btn-ghost-dark">Xem demo</button>
        </div>
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <div className="ft-logo">
        <div className="nav-logo-icon" style={{width:28,height:28,fontSize:14}}>💼</div>
        SmartBudget
      </div>
      <div>© 2026 SmartBudget. Tất cả quyền được bảo lưu.</div>
      <div className="ft-links">
        {["Điều khoản","Bảo mật","Liên hệ"].map(l => <a key={l} href="#">{l}</a>)}
      </div>
    </footer>
  )
}

export default function Page() {
  return (
    <>
      <Navbar/>
      <Hero/>
      <Features/>
      <Report/>
      <Pricing/>
      <Support/>
      <CTA/>
      <Footer/>
    </>
  )
}