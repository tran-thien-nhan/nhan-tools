; ==================================================
; Script TỰ ĐỘNG đăng video lên Facebook
; Chạy ngầm, tự động phát hiện file mới từ TikTok
; ==================================================

#NoEnv
#SingleInstance Force
#Persistent
#NoTrayIcon  ; Ẩn icon khỏi tray (có thể bỏ comment nếu muốn hiện)
SetWorkingDir %A_ScriptDir%
CoordMode, Mouse, Screen

; ==================================================
; CẤU HÌNH
; ==================================================
global VideoFolder := "C:\Users\judyh\Downloads\tiktok_"  ; Thư mục gốc
global ProcessedFile := "processed_files.txt"  ; File lưu danh sách đã xử lý
global X1 := 300  ; Tọa độ X nút "Ảnh/video"
global Y1 := 500  ; Tọa độ Y nút "Ảnh/video"
global X2 := 500  ; Tọa độ X nút "Tiếp"
global Y2 := 600  ; Tọa độ Y nút "Tiếp"

; ==================================================
; KHỞI TẠO
; ==================================================
; Đọc danh sách file đã xử lý
if !FileExist(ProcessedFile)
    FileAppend, , %ProcessedFile%

; Tạo timer kiểm tra mỗi 5 giây
SetTimer, CheckNewVideos, 5000

; Thông báo đã chạy
TrayTip, Facebook Auto Upload, Đã sẵn sàng tự động đăng video!, 5, 1
return

; ==================================================
; KIỂM TRA VIDEO MỚI
; ==================================================
CheckNewVideos:
    ; Lấy tất cả các thư mục con trong Downloads
    Loop, Files, %VideoFolder%*, D
    {
        ; Duyệt từng file .mp4 trong thư mục
        Loop, Files, %A_LoopFileFullPath%\*.mp4
        {
            ; Kiểm tra đã xử lý chưa
            if !IsFileProcessed(A_LoopFileFullPath)
            {
                ; Đánh dấu đã xử lý
                MarkFileAsProcessed(A_LoopFileFullPath)
                
                ; Kích hoạt cửa sổ Facebook
                if !WinActive("ahk_class Chrome_WidgetWin_1")  ; Cho Chrome
                    WinActivate, ahk_class Chrome_WidgetWin_1
                Sleep 1000
                
                ; Bắt đầu đăng video
                UploadVideo(A_LoopFileFullPath)
            }
        }
    }
return

; ==================================================
; HÀM ĐĂNG VIDEO
; ==================================================
UploadVideo(filePath) {
    global X1, Y1, X2, Y2
    
    ; Thông báo bắt đầu
    TrayTip, Facebook Upload, Đang đăng: %filePath%, 5, 1
    
    ; === BƯỚC 1: CLICK NÚT "ẢNH/VIDEO" ===
    Click %X1%, %Y1%
    Sleep 2000
    
    ; === BƯỚC 2: DÁN ĐƯỜNG DẪN FILE ===
    ; Copy đường dẫn vào clipboard
    Clipboard := filePath
    Sleep 500
    
    ; Paste (Ctrl+V)
    Send ^v
    Sleep 1000
    Send {Enter}
    Sleep 5000  ; Đợi upload
    
    ; === BƯỚC 3: CLICK "TIẾP" LẦN 1 ===
    Click %X2%, %Y2%
    Sleep 3000
    
    ; === BƯỚC 4: CLICK "TIẾP" LẦN 2 ===
    Click %X2%, %Y2%
    Sleep 3000
    
    ; Thông báo thành công
    TrayTip, Facebook Upload, Đã đăng thành công!, 3, 1
    SoundPlay, *64
}

; ==================================================
; HÀM KIỂM TRA FILE ĐÃ XỬ LÝ CHƯA
; ==================================================
IsFileProcessed(filePath) {
    FileRead, content, %ProcessedFile%
    if InStr(content, filePath)
        return true
    return false
}

; ==================================================
; HÀM ĐÁNH DẤU FILE ĐÃ XỬ LÝ
; ==================================================
MarkFileAsProcessed(filePath) {
    FileAppend, %filePath%`n, %ProcessedFile%
}

; ==================================================
; HOTKEY THỦ CÔNG (để test)
; ==================================================
; Ctrl+Alt+U: Upload file hiện tại
^!u::
    FileSelectFile, selectedFile, 3, , Chọn video để upload, Video files (*.mp4)
    if (selectedFile != "") {
        UploadVideo(selectedFile)
    }
return

; Ctrl+Alt+S: Lấy tọa độ chuột
^!s::
    MouseGetPos, x, y
    Clipboard := x " " y
    ToolTip, Tọa độ: %x% %y% (đã copy)
    Sleep 2000
    ToolTip
return

; Ctrl+Alt+T: Test click
^!t::
    Click 300, 500
    SoundPlay, *64
return