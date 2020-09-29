export interface ObjectId {
  $oid: string;
}

export function ObjectId($oid: string) {
  const isLegal = /^[0-9a-fA-F]{24}$/.test($oid);
  if (!isLegal) {
    throw new Error(`ObjectId("${$oid}") is not legal.`);
  }
  return { $oid };
}
