// app/notes-app/page.tsx

import NotesApp from "../_components/NotesApp";

export const metadata = {
    title: 'Notes App - Ghi chú và gửi lên Discord',
    description: 'Ghi chú nhanh, đồng bộ localStorage, gửi lên Discord',
};

export default function NotesAppPage() {
    return <NotesApp />;
}