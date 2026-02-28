"use client"

import { useEffect, useState } from "react"
import { Dumbbell, Loader2, RotateCcw, Sparkles } from "lucide-react"
import { GoogleGenAI } from "@google/genai"
import rawExercises from "../_data/exercises.json"
import { model } from "../_data/model"

interface UserProfile {
    age: number
    weight: number
    gender: string
    targetWeight: number
    duration: number
    goal: string
    injury: string
}

interface Exercise {
    id: string
    name: string
    muscles: string[]
    image?: string
    video?: string
}

export default function HomeWorkoutAI() {
    const [profile, setProfile] = useState<UserProfile>({
        age: 0,
        weight: 0,
        gender: "",
        targetWeight: 0,
        duration: 0,
        goal: "",
        injury: ""
    })

    const [result, setResult] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const exercises = rawExercises as Exercise[];

    useEffect(() => {
        const saved = sessionStorage.getItem("workout-profile")
        if (saved) setProfile(JSON.parse(saved))
    }, [])

    const generateWorkout = async () => {
        setLoading(true)
        sessionStorage.setItem("workout-profile", JSON.stringify(profile))

        try {
            const ai = new GoogleGenAI({
                apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
            })

            const prompt = `
      Người dùng:
      Tuổi: ${profile.age}
      Cân nặng: ${profile.weight}
      Giới tính: ${profile.gender}
      Cân nặng mong muốn: ${profile.targetWeight}
      Thời gian: ${profile.duration} tuần
      Mục tiêu: ${profile.goal}
      Chấn thương: ${profile.injury}

      Đây là danh sách bài tập JSON:
      ${JSON.stringify(exercises)}

      Hãy chọn ra 5 bài tập phù hợp nhất cho 1 ngày tập.

      Chỉ trả về JSON array gồm:
      [
        { "id": number, "sets": number, "reps": number }
      ]

      Chỉ trả về JSON thuần. Không dùng markdown.
      `

            const response = await ai.models.generateContent({
                model: model,
                contents: prompt
            })

            let raw = response.text || "[]"
            raw = raw.replace(/```json/gi, "")
            raw = raw.replace(/```/g, "")
            raw = raw.trim()

            let parsed: any[] = []

            try {
                parsed = JSON.parse(raw)
            } catch (e) {
                console.error("Parse error:", e)
                console.log("Raw:", raw)
            }

            const mapped = parsed.map((item: any) => {
                const found = exercises.find((e) => e.id === item.id)
                return { ...found, ...item }
            })

            setResult(mapped)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        sessionStorage.removeItem("workout-profile")
        setProfile({
            age: 0,
            weight: 0,
            gender: "",
            targetWeight: 0,
            duration: 0,
            goal: "",
            injury: ""
        })
        setResult([])
    }

    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return null

        try {
            const parsedUrl = new URL(url)

            // youtube.com/watch?v=
            if (parsedUrl.hostname.includes("youtube.com")) {
                if (parsedUrl.pathname === "/watch") {
                    const id = parsedUrl.searchParams.get("v")
                    return id ? `https://www.youtube.com/embed/${id}` : null
                }

                // /shorts/ID
                if (parsedUrl.pathname.startsWith("/shorts/")) {
                    const id = parsedUrl.pathname.split("/shorts/")[1]
                    return `https://www.youtube.com/embed/${id}`
                }

                // already embed
                if (parsedUrl.pathname.startsWith("/embed/")) {
                    return url
                }
            }

            // youtu.be/ID
            if (parsedUrl.hostname.includes("youtu.be")) {
                const id = parsedUrl.pathname.replace("/", "")
                return `https://www.youtube.com/embed/${id}`
            }

            return null
        } catch {
            return null
        }
    }

    const inputClass =
        "w-full px-4 py-3 rounded-2xl border border-zinc-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-zinc-100 px-4 py-10">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* HEADER */}
                <div className="text-center space-y-3">
                    <div className="flex justify-center">
                        <div className="p-4 bg-rose-600 text-white rounded-3xl shadow-lg">
                            <Dumbbell size={32} />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Home Workout AI
                    </h1>
                    <p className="text-zinc-600 max-w-xl mx-auto">
                        Cá nhân hóa lịch tập tại nhà dựa trên thể trạng và mục tiêu của bạn
                    </p>
                    <button
                        onClick={() => setResult([])}
                        className="mb-4 text-sm text-rose-600 hover:underline"
                    >
                        ← Chỉnh sửa thông tin
                    </button>
                </div>

                {/* MAIN GRID */}
                <div
                    className={`grid gap-10 ${result.length > 0 ? "grid-cols-1" : "lg:grid-cols-2"
                        }`}
                >

                    {/* FORM CARD */}
                    {
                        result.length === 0 && (
                            <div className="bg-white/70 backdrop-blur-xl border border-zinc-200 rounded-3xl p-8 shadow-xl space-y-6">

                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Sparkles size={18} />
                                    Thông tin cá nhân
                                </h2>

                                <div className="grid md:grid-cols-2 gap-5">

                                    <div>
                                        <label className="text-sm font-medium">Tuổi</label>
                                        <input
                                            type="number"
                                            value={profile.age || ""}
                                            onChange={(e) =>
                                                setProfile({ ...profile, age: Number(e.target.value) })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Cân nặng (kg)</label>
                                        <input
                                            type="number"
                                            value={profile.weight || ""}
                                            onChange={(e) =>
                                                setProfile({ ...profile, weight: Number(e.target.value) })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Giới tính</label>
                                        <select
                                            value={profile.gender}
                                            onChange={(e) =>
                                                setProfile({ ...profile, gender: e.target.value })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">Chọn</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Cân nặng mục tiêu</label>
                                        <input
                                            type="number"
                                            value={profile.targetWeight || ""}
                                            onChange={(e) =>
                                                setProfile({ ...profile, targetWeight: Number(e.target.value) })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Thời gian (tuần)</label>
                                        <input
                                            type="number"
                                            value={profile.duration || ""}
                                            onChange={(e) =>
                                                setProfile({ ...profile, duration: Number(e.target.value) })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Mục tiêu</label>
                                        <select
                                            value={profile.goal}
                                            onChange={(e) =>
                                                setProfile({ ...profile, goal: e.target.value })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">Chọn</option>
                                            <option value="Tăng cơ">Tăng cơ</option>
                                            <option value="Giảm mỡ">Giảm mỡ</option>
                                            <option value="Giữ dáng">Giữ dáng</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium">
                                            Tiền sử chấn thương
                                        </label>
                                        <textarea
                                            value={profile.injury}
                                            onChange={(e) =>
                                                setProfile({ ...profile, injury: e.target.value })
                                            }
                                            className={`${inputClass} min-h-[100px] resize-none`}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        onClick={generateWorkout}
                                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-2xl font-semibold shadow-lg transition flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={18} />
                                        ) : (
                                            "Tạo chương trình tập hôm nay"
                                        )}
                                    </button>

                                    <button
                                        onClick={reset}
                                        className="flex-1 border border-zinc-300 hover:bg-zinc-100 py-3 rounded-2xl font-medium transition flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={18} />
                                        Reset
                                    </button>
                                </div>
                            </div>
                        )
                    }

                    {/* RESULT CARD */}
                    <div className="space-y-6">

                        {result.length === 0 && (
                            <div className="h-full flex items-center justify-center bg-white/60 border border-dashed border-zinc-300 rounded-3xl p-10 text-center text-zinc-500">
                                Lịch tập sẽ hiển thị tại đây sau khi bạn tạo
                            </div>
                        )}

                        {result.length > 0 && (
                            <div className="grid sm:grid-cols-2 gap-6">
                                {result.map((ex, i) => (
                                    <div
                                        key={i}
                                        className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-md hover:shadow-xl transition"
                                    >
                                        <h3 className="font-bold text-lg">{ex.name}</h3>
                                        <p className="text-sm text-zinc-500 mb-3">
                                            {ex.muscles?.join(", ")}
                                        </p>

                                        {/* MEDIA */}
                                        {ex.video ? (
                                            <>
                                                {getYoutubeEmbedUrl(ex.video) ? (
                                                    <iframe
                                                        src={getYoutubeEmbedUrl(ex.video)!}
                                                        className="w-full h-48 rounded-2xl mb-3"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <video
                                                        src={ex.video}
                                                        controls
                                                        className="w-full h-48 object-cover rounded-2xl mb-3"
                                                    />
                                                )}
                                            </>
                                        ) : ex.image ? (
                                            <img
                                                src={ex.image}
                                                className="w-full h-40 object-cover rounded-2xl mb-3"
                                            />
                                        ) : null}

                                        <div className="mt-4 text-center bg-rose-50 text-rose-700 font-semibold py-2 rounded-xl">
                                            {ex.sets} hiệp × {ex.reps} reps
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}