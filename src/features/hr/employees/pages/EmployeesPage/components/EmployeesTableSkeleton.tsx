import { Table, Skeleton } from "@/shared/ui";

export default function EmployeesTableSkeleton() {
  return (
    <Table.Table>
      <Table.Header>
        <tr>
          <Table.HeadCell className="w-6">
            <Skeleton width={18} height={18} />
          </Table.HeadCell>

          <Table.HeadCell>
            <Skeleton width={90} height={16} />
          </Table.HeadCell>

          <Table.HeadCell>
            <Skeleton width={80} height={16} />
          </Table.HeadCell>

          <Table.HeadCell>
            <Skeleton width={70} height={16} />
          </Table.HeadCell>

          <Table.HeadCell>
            <Skeleton width={80} height={16} />
          </Table.HeadCell>

          <Table.HeadCell>
            <Skeleton width={80} height={16} />
          </Table.HeadCell>

          <Table.HeadCell>
            <Skeleton width={60} height={16} />
          </Table.HeadCell>

          {}
          <Table.HeadCell>
            <Skeleton width={70} height={16} />
          </Table.HeadCell>

          {}
          <Table.HeadCell>
            <Skeleton width={40} height={16} />
          </Table.HeadCell>
        </tr>
      </Table.Header>

      <Table.Body>
        {Array.from({ length: 8 }).map((_, idx) => (
          <Table.Row key={idx}>
            <Table.Cell>
              <Skeleton width={18} height={18} />
            </Table.Cell>

            <Table.Cell>
              <Skeleton width={140} height={14} />
            </Table.Cell>

            <Table.Cell>
              <Skeleton width={160} height={14} />
            </Table.Cell>

            <Table.Cell>
              <Skeleton width={100} height={14} />
            </Table.Cell>

            <Table.Cell>
              <Skeleton width={100} height={14} />
            </Table.Cell>

            <Table.Cell>
              <Skeleton width={110} height={14} />
            </Table.Cell>

            <Table.Cell>
              <Skeleton width={90} height={14} />
            </Table.Cell>

            <Table.Cell>
              <Skeleton width={80} height={20} />
            </Table.Cell>

            <Table.Cell>
              <Skeleton width={20} height={20} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Table>
  );
}
