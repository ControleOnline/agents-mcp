export const WORKING_LIMIT = 5;

function createdAtMs(item) {
  const value = item?.content?.createdAt || item?.createdAt || '';
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function issueNumber(item) {
  return Number(item?.content?.number ?? item?.number ?? Number.MAX_SAFE_INTEGER);
}

/**
 * Keep exactly the oldest Working tasks when capacity is exceeded.
 *
 * Business rule:
 * - Working is a hard global cap of five tasks.
 * - The five oldest tasks by createdAt stay in Working.
 * - Tie-breaker: lower issue number stays first.
 * - Every excess task must be returned to Ready before any other capture.
 */
export function splitWorkingByCapacity(items, limit = WORKING_LIMIT) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('Working limit must be a positive integer.');
  }

  const sorted = [...items].sort((left, right) => {
    const createdDelta = createdAtMs(left) - createdAtMs(right);
    if (createdDelta !== 0) return createdDelta;
    return issueNumber(left) - issueNumber(right);
  });

  return {
    keep: sorted.slice(0, limit),
    overflow: sorted.slice(limit),
  };
}

export function assertWorkingCapacity(currentWorkingCount, requestedAdds = 1, limit = WORKING_LIMIT) {
  if (!Number.isInteger(currentWorkingCount) || currentWorkingCount < 0) {
    throw new Error('Current Working count must be a non-negative integer.');
  }
  if (!Number.isInteger(requestedAdds) || requestedAdds < 0) {
    throw new Error('Requested Working additions must be a non-negative integer.');
  }
  if (currentWorkingCount + requestedAdds > limit) {
    throw new Error(
      `Working capacity exceeded: ${currentWorkingCount}+${requestedAdds} would produce ${currentWorkingCount + requestedAdds}/${limit}.`
    );
  }
  return true;
}
