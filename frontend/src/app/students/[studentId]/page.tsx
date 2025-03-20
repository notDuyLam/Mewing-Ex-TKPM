// app/students/[studentId]/page.tsx
export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Student Detail Page</h1>
    </div>
  );
}