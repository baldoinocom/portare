import { db } from '@/lib/db'
import { UF } from '@prisma/client'

async function main() {
  if (process.env.NODE_ENV !== 'development') return

  await db.$transaction([
    db.unit.create({
      data: {
        company: {
          connectOrCreate: {
            where: { cnpj: '86447224000161' },
            create: {
              name: 'COMIX TRANSPORTES LTDA',
              tradeName: 'COMIX SANTA CATARINA',
              cnpj: '86447224000161',
              address:
                'RODOVIA BR 101, S/N KM 326,5 VILA FLOR CAPIVARI DE BAIXO - SC 88745-000',
              uf: UF.sc,
            },
          },
        },
      },
    }),
    db.unit.create({
      data: {
        company: {
          connectOrCreate: {
            where: { cnpj: '86447224002296' },
            create: {
              name: 'COMIX TRANSPORTES LTDA',
              tradeName: 'COMIX PARANÁ',
              cnpj: '86447224002296',
              address:
                'AVENIDA JUSCELINO KUBITSCHEK DE OLIVEIRA, 1975 CIDADE INDUSTRIAL CURITIBA - PR 81280-140',
              uf: UF.pr,
            },
          },
        },
      },
    }),

    db.client.create({
      data: {
        company: {
          connectOrCreate: {
            where: { cnpj: '93953779000140' },
            create: {
              name: 'VOX CIMENTOS LTDA',
              tradeName: 'VOX CIMENTOS',
              cnpj: '93953779000140',
              address:
                'AVENIDA GENERAL CARLOS CAVALCANTI, 5000 UVARANAS PONTA GROSSA - SC 84030-900',
              uf: UF.sc,
            },
          },
        },
      },
    }),
    db.client.create({
      data: {
        company: {
          connectOrCreate: {
            where: { cnpj: '82158361000125' },
            create: {
              name: 'NORTE INDUSTRIA E COMERCIO LTDA',
              tradeName: 'NORTE INDUSTRIA',
              cnpj: '82158361000125',
              address:
                'AVENIDA LUIZ XAVIER, 68 CENTRO PONTA GROSSA - PR 84010-000',
              uf: UF.pr,
            },
          },
        },
      },
    }),

    db.driver.create({
      data: {
        person: {
          create: {
            name: 'BRUNO HENRIQUE DE OLIVEIRA',
            nickname: 'OLIVEIRA',
            cpf: '10640254047',
            phoneNumber: '48985456478',
            unit: { connect: { companyId: 1 } },
          },
        },
        cnh: '70315808200',
      },
    }),
    db.truck.create({
      data: {
        vehicle: {
          create: {
            licensePlate: 'HJK-8901',
            brand: {
              create: {
                name: 'VOLVO',
              },
            },
            model: 'FH-16',
            year: '2022',
            renavam: '63482170849',
            axle: 4,
            unit: { connect: { companyId: 1 } },
          },
        },
        compressor: true,
      },
    }),
    db.semiTrailer.create({
      data: {
        cargos: { create: { name: 'CIMENTO' } },
        type: { create: { name: 'SILO' } },
        configuration: { create: { name: 'LS', numberOfTrailers: 1 } },
        trailers: {
          create: {
            vehicle: {
              create: {
                licensePlate: 'OPQ-5678',
                brand: {
                  create: {
                    name: 'RANDON',
                  },
                },
                year: '2022',
                renavam: '63103003248',
                axle: 4,
                unit: { connect: { companyId: 1 } },
              },
            },
            fleetNumber: '4002',
          },
        },
      },
    }),
  ])
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
