import { useState, useEffect } from "react";
import { MOCK_STUDY_GROUPS } from "../../../mock/brainstorming/mockData";
import { MOCK_GROUP_WORKS } from "../../../mock/brainstorming/groupWorksMockData";

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
    const foundGroup = MOCK_STUDY_GROUPS.find((g) => g.id === groupId);
    const foundWorks = MOCK_GROUP_WORKS[groupId] || [];

    setGroup(foundGroup);
    setWorks(foundWorks);
    setLoading(false);
  }, [groupId]);

  return { group, works, loading, error };
}

