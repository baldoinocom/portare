export const FormFields = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
      {children}
    </div>
  )
}
