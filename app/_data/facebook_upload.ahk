; ==================================================
; Script tự động đăng video lên Facebook
; Hotkey: Ctrl+Alt+V
; ==================================================

#NoEnv
#SingleInstance Force
#Persistent
SetWorkingDir %A_ScriptDir%
CoordMode, Mouse, Screen

; Menu tray
Menu, Tray, Icon, shell32.dll, 165
Menu, Tray, Tip, Facebook Video Uploader

; ==================================================
; HOTKEY CHÍNH: Ctrl+Alt+V - Đăng video hiện tại
; ==================================================
^!v::
    ; Kiểm tra file đã được copy chưa
    if (clipboard = "") {
        MsgBox, 48, Lỗi, Vui lòng copy đường dẫn file video trước!
        return
    }
    
    ; Kiểm tra file có tồn tại không
    if !FileExist(clipboard) {
        MsgBox, 48, Lỗi, File không tồn tại: %clipboard%
        return
    }
    
    ; Thông báo bắt đầu
    TrayTip, Facebook Upload, Đang đăng video: %clipboard%, 10, 1
    
    ; === BƯỚC 1: CLICK NÚT "ẢNH/VIDEO" ===
    ; (Điều chỉnh tọa độ theo màn hình của bạn)
    Click 300, 500  ; Tọa độ nút "Ảnh/video"
    Sleep 2000
    
    ; === BƯỚC 2: DÁN ĐƯỜNG DẪN FILE ===
    Send ^v  ; Ctrl+V
    Sleep 1000
    Send {Enter}
    Sleep 5000  ; Đợi upload
    
    ; === BƯỚC 3: CLICK "TIẾP" LẦN 1 ===
    Click 500, 600  ; Tọa độ nút "Tiếp" lần 1
    Sleep 3000
    
    ; === BƯỚC 4: CLICK "TIẾP" LẦN 2 ===
    Click 500, 600  ; Tọa độ nút "Tiếp" lần 2
    Sleep 3000
    
    ; Thông báo thành công
    TrayTip, Facebook Upload, Đã đăng video thành công!, 5, 1
    SoundPlay, *64  ; Beep báo thành công
return

; ==================================================
; Hotkey phụ: Ctrl+Alt+S - Lấy tọa độ chuột
; ==================================================
^!s::
    MouseGetPos, x, y
    clipboard = %x% %y%
    ToolTip, Tọa độ: %x% %y% (đã copy)
    Sleep 2000
    ToolTip
return

; ==================================================
; Hotkey phụ: Ctrl+Alt+T - Test click
; ==================================================
^!t::
    Click 300, 500
    SoundPlay, *64
    ToolTip, Đã click tại (300,500)
    Sleep 1000
    ToolTip
return

; ==================================================
; Tạo menu tray
; ==================================================
Menu, Tray, Add, Cài đặt tọa độ, ShowSettings
Menu, Tray, Add, Hướng dẫn, ShowHelp
Menu, Tray, Add
Menu, Tray, Add, Thoát, ExitScript

ShowSettings:
    Gui, New,, Cài đặt tọa độ click
    Gui, Add, Text,, Nút "Ảnh/video":
    Gui, Add, Edit, vX1 w100, 300
    Gui, Add, Edit, vY1 w100, 500
    Gui, Add, Text,, Nút "Tiếp" (lần 1 & 2):
    Gui, Add, Edit, vX2 w100, 500
    Gui, Add, Edit, vY2 w100, 600
    Gui, Add, Button, gSaveCoords, Lưu
    Gui, Show
return

SaveCoords:
    Gui, Submit
    ; Lưu vào registry hoặc file INI
    IniWrite, %X1%, coordinates.ini, Buttons, X1
    IniWrite, %Y1%, coordinates.ini, Buttons, Y1
    IniWrite, %X2%, coordinates.ini, Buttons, X2
    IniWrite, %Y2%, coordinates.ini, Buttons, Y2
    MsgBox, Đã lưu tọa độ!
    Gui, Destroy
return

ShowHelp:
    MsgBox, 64, Hướng dẫn,
    (
    CÁCH SỬ DỤNG:
    
    1. Ctrl+Alt+V: Đăng video
       - Copy đường dẫn file trước
       - Đưa chuột vào vị trí fanpage
    
    2. Ctrl+Alt+S: Lấy tọa độ chuột
       - Đưa chuột vào vị trí cần click
       - Nhấn Ctrl+Alt+S để copy tọa độ
    
    3. Ctrl+Alt+T: Test click
       - Test click tại tọa độ (300,500)
    
    4. Điều chỉnh tọa độ trong menu tray
    )
return

ExitScript:
    ExitApp
return