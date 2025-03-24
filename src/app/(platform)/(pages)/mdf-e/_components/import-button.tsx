'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { format } from 'date-fns'
import { Loader2, UploadIcon } from 'lucide-react'
import * as React from 'react'
import * as XLSX from 'xlsx'
import { z } from 'zod'
import { importMDFe } from '../_actions/import-mdfe'
import { MDFeSchema } from '../_actions/type'

type Input = {
  'Dt. Emissao': string
  'Emis Nf Cli': string
  Filial: string
  'Local Entreg': string
  'NF CLIENTE': string
  'No.Manifesto': number
  'Nome Destina': string
  'Numero CTRC': string
  'Placa Veicul': string
}

const extractAndFormatRows = (sheet: XLSX.WorkSheet, range: number) => {
  try {
    const json = XLSX.utils.sheet_to_json<Input>(sheet, {
      range,
      raw: false,
    })

    const rows = json.map((row) => ({
      Manifesto: String(Number(row['No.Manifesto'])),
      Filial: row.Filial,
      Caminhão: row['Placa Veicul'],
      Destinatário: row['Nome Destina'],
      Endereço: row['Local Entreg'],
      'Nota Fiscal': String(Number(row['NF CLIENTE'])),
      'Emissão da Nf': format(new Date(row['Emis Nf Cli']), 'dd/MM/yyyy'),
      CTe: String(Number(row['Numero CTRC'])),
      'Emissão do CTe': format(new Date(row['Dt. Emissao']), 'dd/MM/yyyy'),
    }))

    return rows
  } catch (error) {
    return false
  }
}

export const ImportButton = () => {
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

        let rows = extractAndFormatRows(sheet, 3)

        // Fix: If the first range is not valid, try the second range
        if (!rows) rows = extractAndFormatRows(sheet, 4)

        const data = z.array(MDFeSchema).parse(rows)

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
    <Button
      size="sm"
      variant="outline"
      onClick={handleFileSelect}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-1 size-4 animate-spin" />
      ) : (
        <UploadIcon className="mr-1 size-4" />
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
