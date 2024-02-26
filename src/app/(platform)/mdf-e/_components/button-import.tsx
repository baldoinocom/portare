'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { format } from 'date-fns'
import { Loader2, UploadIcon } from 'lucide-react'
import * as React from 'react'
import * as XLSX from 'xlsx'
import { importMDFe } from '../_actions/import-mdfe'
import { MDFeSchema, MDFeType } from '../_actions/type'

export const ButtonImport = () => {
  const { toast } = useToast()

  const { execute } = useAction(importMDFe, {
    onSuccess: () => {
      toast({
        title: 'MDF-e importados com sucesso',
        description: 'Os MDF-e foram importados com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao importar MDF-e',
        description: error,
      })
    },
  })

  const handleFileSelect = () => {
    const fileInput = document.getElementById('file')
    fileInput?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (loading || !event?.target?.files?.length) return

    const fileTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ]

    const selectedFile = event.target.files[0]

    if (!selectedFile || !fileTypes.includes(selectedFile.type)) {
      toast({
        variant: 'destructive',
        title: 'Erro ao importar MDF-e',
        description:
          'Tipo de arquivo inválido, selecione um arquivo do tipo .xls, .xlsx ou .csv e tente novamente',
      })
    } else {
      handleFileRead(selectedFile)
    }
  }

  const handleFileRead = (file: File) => {
    try {
      setLoading(true)

      const reader = new FileReader()

      reader.readAsArrayBuffer(file)

      reader.onload = async (event) => {
        if (!event?.target?.result) throw new Error()

        const workbook = XLSX.read(event.target.result, { type: 'array' })

        const sheetName = workbook.SheetNames[0]

        const sheet = workbook.Sheets[sheetName]

        const json = XLSX.utils.sheet_to_json<MDFeType[0]>(sheet, {
          range: 3,
          raw: false,
        })

        const rows = json.map((row) => ({
          ...row,
          'No.Manifesto': Number(row['No.Manifesto']),
          'NF CLIENTE': String(Number(row['NF CLIENTE'])),
          'Numero CTRC': String(Number(row['Numero CTRC'])),
          'Dt. Emissao': format(new Date(row['Dt. Emissao']), 'dd/MM/yyyy'),
          'Emis Nf Cli': format(new Date(row['Emis Nf Cli']), 'dd/MM/yyyy'),
        }))

        const data = MDFeSchema.parse(rows)

        await execute(data)

        setLoading(false)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao importar MDF-e',
        description:
          'Verifique se o dados do arquivo estão corretos e tente novamente',
      })

      setLoading(false)
    }
  }

  const [loading, setLoading] = React.useState(false)

  return (
    <Button variant="outline" onClick={handleFileSelect} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 animate-spin" />
      ) : (
        <UploadIcon className="mr-1.5" />
      )}
      Importar
      <input
        id="file"
        type="file"
        className="sr-only"
        onChange={handleFileChange}
      />
    </Button>
  )
}
