import { Table, Skeleton } from "@/shared/ui";

export default function TimesheetsPageSkeleton() {
  return (
    <Table.Table>
      <Table.Header>
        <tr>
          <Table.HeadCell>
            <Skeleton width={120} height={16} />
          </Table.HeadCell>
          <Table.HeadCell>
            <Skeleton width={80} height={16} />
          </Table.HeadCell>
          <Table.HeadCell>
            <Skeleton width={100} height={16} />
          </Table.HeadCell>
          <Table.HeadCell>
            <Skeleton width={100} height={16} />
          </Table.HeadCell>
          <Table.HeadCell>
            <Skeleton width={80} height={16} />
          </Table.HeadCell>
          <Table.HeadCell>
            <Skeleton width={70} height={16} />
          </Table.HeadCell>
        </tr>
      </Table.Header>
      <Table.Body>
        {Array.from({ length: 8 }).map((_, idx) => (
          <Table.Row key={idx}>
            <Table.Cell>
              <Skeleton width={140} height={14} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton width={70} height={24} borderRadius={12} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton width={50} height={14} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton width={60} height={14} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton width={40} height={14} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton width={32} height={32} borderRadius={4} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Table>
  );
}

