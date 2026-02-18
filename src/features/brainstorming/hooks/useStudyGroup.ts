import { useState, useEffect } from "react";

export function useStudyGroup(groupId: string | undefined) {
  const [group, setGroup] = useState<any>(null);
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    // TODO: 실제 API 연동
    setGroup(null);
    setWorks([]);
    setLoading(false);
  }, [groupId]);

  return { group, works, loading, error };
}

