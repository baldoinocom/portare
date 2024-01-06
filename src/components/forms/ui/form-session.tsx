export const FormSession = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
      {children}
    </div>
  )
}
