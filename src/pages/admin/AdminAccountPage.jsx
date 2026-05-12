import { useState } from "react"
import { useForm } from "react-hook-form"
import { UserPlus } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { createAdmin } from "../../api/adminApi"
import styles from "./AdminAccountPage.module.css"

const ROLES = [
  { value: "CS_ADMIN", label: "CS 관리자" },
  { value: "SUPER_ADMIN", label: "운영 관리자" },
]

export default function AdminAccountPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { role: "CS_ADMIN" } })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await createAdmin(data)
      alert("관리자 계정이 등록되었습니다.")
      reset({ role: "CS_ADMIN" })
    } catch (err) {
      const message = err.response?.data?.message
      alert(message ?? "관리자 등록에 실패했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>관리자 계정 관리</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <UserPlus size={18} />
            신규 관리자 등록
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>이름</label>
                <input
                  className={`${styles.input} ${errors.adminName ? styles.inputError : ""}`}
                  placeholder="이름 입력"
                  {...register("adminName", { required: "이름을 입력해주세요" })}
                />
                {errors.adminName && <p className={styles.fieldError}>{errors.adminName.message}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>연락처</label>
                <input
                  className={`${styles.input} ${errors.adminPhone ? styles.inputError : ""}`}
                  placeholder="01012341234"
                  {...register("adminPhone", {
                    required: "연락처를 입력해주세요",
                    pattern: { value: /^010\d{8}$/, message: "올바른 형식이 아닙니다 (예: 01012341234)" },
                  })}
                />
                {errors.adminPhone && <p className={styles.fieldError}>{errors.adminPhone.message}</p>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>이메일</label>
                <input
                  type="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  placeholder="admin@allpick.com"
                  {...register("email", {
                    required: "이메일을 입력해주세요",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "올바른 이메일 형식이 아닙니다" },
                  })}
                />
                {errors.email && <p className={styles.fieldError}>{errors.email.message}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>권한</label>
                <select className={styles.select} {...register("role")}>
                  {ROLES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>비밀번호</label>
              <input
                type="password"
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                placeholder="최소 8자, 영문+숫자+특수문자"
                {...register("password", {
                  required: "비밀번호를 입력해주세요",
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    message: "최소 8자, 영문+숫자+특수문자 조합이어야 합니다",
                  },
                })}
              />
              {errors.password && <p className={styles.fieldError}>{errors.password.message}</p>}
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "등록 중..." : "등록"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
