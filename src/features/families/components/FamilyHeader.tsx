import { useParams } from 'react-router-dom';
import { PageTitle } from '@/components/layout/TopBar';
import { formatDate } from '@/lib/format';
import { useFamily } from '../api';

/** Top-bar title for /families/:familyId — "{Parent name}" / "Parent account · Joined {date}". */
export function FamilyHeader() {
  const { familyId } = useParams();
  const { data } = useFamily(familyId);
  return (
    <PageTitle
      title={data?.parentName ?? 'Family'}
      subtitle={data ? `Parent account · Joined ${formatDate(data.joinedAt)}` : undefined}
    />
  );
}
