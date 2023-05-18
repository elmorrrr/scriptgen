import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import RoundIcon from "@/components/RoundIcon"
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from "@/icons"

import InfoCard from "@/components/cards/InfoCard"
import { db } from "@/lib/db"

export const metadata = {
  title: "Admin",
  description: "Admin",
}

export default async function ClientPage() {
  const total_users = await db.user.count()
  const total_scripts = await db.config.count()
  const total_scripts_validated = await db.config.count({
    where: {
      status: "validated",
    },
  })
  const total_scripts_rejected = await db.config.count({
    where: {
      status: "rejected",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Admin Dashboard"
        text="Managing clients, scripts, and more."
      />
      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total clients" value={total_users}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={<PeopleIcon />}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total scripts" value={total_scripts}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Validated scripts" value={total_scripts_validated}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
        <InfoCard title="Rejected scripts" value={total_scripts_rejected}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-red-500 dark:text-red-100"
            bgColorClass="bg-red-100 dark:bg-red-500"
            className="mr-4"
          />
        </InfoCard>
      </div>
    </DashboardShell>
  )
}

// // import CTA from "@/components/CTA"
// // import ChartCard from "@/components/Chart/ChartCard"
// // import ChartLegend from "@/components/Chart/ChartLegend"
// // import PageTitle from "@/components/Typography/PageTitle"
// // import response, { ITableData } from "utils/demo/tableData"
// // import { Doughnut, Line } from "react-chartjs-2"
// // import {
// //   doughnutOptions,
// //   lineOptions,
// //   doughnutLegends,
// //   lineLegends,
// // } from "@/utils/demo/chartsData"

// // import {
// //   Chart,
// //   ArcElement,
// //   CategoryScale,
// //   LinearScale,
// //   PointElement,
// //   LineElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from "chart.js"

// import { DashboardHeader } from "@/components/header"
// import { DashboardShell } from "@/components/shell"
// import RoundIcon from "@/components/RoundIcon"
// import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from "@/icons"
// // import {
// //   TableBody,
// //   TableContainer,
// //   Table,
// //   TableHeader,
// //   TableCell,
// //   TableRow,
// //   TableFooter,
// //   Avatar,
// //   Badge,
// //   Pagination,
// // } from "@roketid/windmill-react-ui"
// import InfoCard from "@/components/cards/InfoCard"
// import { db } from "@/lib/db"

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js"
// import { Bar } from "react-chartjs-2"

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// const options = {
//   plugins: {
//     title: {
//       display: true,
//       text: "Chart.js Bar Chart - Stacked",
//     },
//   },
//   responsive: true,
//   scales: {
//     x: {
//       stacked: true,
//     },
//     y: {
//       stacked: true,
//     },
//   },
// }

// async function getData() {
//   const total_scripts = await db.config.count()
//   const total_scripts_validated = await db.config.count({
//     where: {
//       status: "validated",
//     },
//   })
//   const total_scripts_rejected = await db.config.count({
//     where: {
//       status: "rejected",
//     },
//   })

//   return {
//     labels: ["Total Scripts", "Validated Scripts", "Rejected Scripts"],
//     datasets: [
//       {
//         label: "Scripts Count",
//         data: [total_scripts, total_scripts_validated, total_scripts_rejected],
//         backgroundColor: [
//           "rgb(255, 99, 132)",
//           "rgb(75, 192, 192)",
//           "rgb(53, 162, 235)",
//         ],
//       },
//     ],
//   }
// }

// export const metadata = {
//   title: "Admin",
//   description: "Admin dashboard",
// }

// export default async function ClientPage() {
//   const data = await getData()
//   const total_users = await db.user.count()
//   const total_scripts = await db.config.count()
//   const total_scripts_validated = await db.config.count({
//     where: {
//       status: "validated",
//     },
//   })
//   const total_scripts_rejected = await db.config.count({
//     where: {
//       status: "rejected",
//     },
//   })

//   return (
//     <DashboardShell>
//       <DashboardHeader
//         heading="Admin Dashboard"
//         text="Managing clients, scripts, and more"
//       />
//       <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
//         <InfoCard title="Total clients" value={total_users}>
//           {/* @ts-ignore */}
//           <RoundIcon
//             icon={<PeopleIcon />}
//             iconColorClass="text-orange-500 dark:text-orange-100"
//             bgColorClass="bg-orange-100 dark:bg-orange-500"
//             className="mr-4"
//           />
//         </InfoCard>

//         <InfoCard title="Total scripts" value={total_scripts}>
//           {/* @ts-ignore */}
//           <RoundIcon
//             icon={CartIcon}
//             iconColorClass="text-blue-500 dark:text-blue-100"
//             bgColorClass="bg-blue-100 dark:bg-blue-500"
//             className="mr-4"
//           />
//         </InfoCard>

//         <InfoCard title="Validated scripts" value={total_scripts_validated}>
//           {/* @ts-ignore */}
//           <RoundIcon
//             icon={ChatIcon}
//             iconColorClass="text-teal-500 dark:text-teal-100"
//             bgColorClass="bg-teal-100 dark:bg-teal-500"
//             className="mr-4"
//           />
//         </InfoCard>
//         <InfoCard title="Rejected scripts" value={total_scripts_rejected}>
//           {/* @ts-ignore */}
//           <RoundIcon
//             icon={MoneyIcon}
//             iconColorClass="text-red-500 dark:text-red-100"
//             bgColorClass="bg-red-100 dark:bg-red-500"
//             className="mr-4"
//           />
//         </InfoCard>
//       </div>
//       {data ? <Bar options={options} data={data} /> : null}
//       {/* <TableContainer>
//         <Table>
//           <TableHeader>
//             <tr>
//               <TableCell>Client</TableCell>
//               <TableCell>Amount</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Date</TableCell>
//             </tr>
//           </TableHeader>
//           <TableBody>
//             {response
//               .slice((page - 1) * resultsPerPage, page * resultsPerPage)
//               .map((user, i) => (
//                 <TableRow key={i}>
//                   <TableCell>
//                     <div className="flex items-center text-sm">
//                       <Avatar
//                         className="mr-3 hidden md:block"
//                         src={user.avatar}
//                         alt="User image"
//                       />
//                       <div>
//                         <p className="font-semibold">{user.name}</p>
//                         <p className="text-xs text-gray-600 dark:text-gray-400">
//                           {user.job}
//                         </p>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <span className="text-sm">$ {user.amount}</span>
//                   </TableCell>
//                   <TableCell>
//                     <Badge type={user.status}>{user.status}</Badge>
//                   </TableCell>
//                   <TableCell>
//                     <span className="text-sm">
//                       {new Date(user.date).toLocaleDateString()}
//                     </span>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//         <TableFooter>
//           <Pagination
//             totalResults={totalResults}
//             resultsPerPage={resultsPerPage}
//             label="Table navigation"
//             onChange={onPageChange}
//           />
//         </TableFooter>
//       </TableContainer> */}

//       {/* <PageTitle>Charts</PageTitle> */}
//       {/* <div className="mb-8 grid gap-6 md:grid-cols-2">
//         <ChartCard title="Revenue">
//           <Doughnut {...doughnutOptions} />
//           <ChartLegend legends={doughnutLegends} />
//         </ChartCard>

//         <ChartCard title="Traffic">
//           <Line {...lineOptions} />
//           <ChartLegend legends={lineLegends} />
//         </ChartCard>
//       </div> */}
//     </DashboardShell>
//   )
// }
