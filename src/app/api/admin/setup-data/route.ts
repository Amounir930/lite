import { NextResponse } from "next/server";
import { prisma } from "@/infra/db/prisma";
import { getSession } from "@/infra/auth/session";

export async function GET() {
  const session = await getSession();
  if (!session.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prismaAny = prisma as any;

    // 🛡️ Expert Logic: Use Raw Fetching to bypass ORM Caching/Casings
    const [roles, rawDepts1, rawDepts2]: any = await Promise.all([
      prisma.role.findMany({ where: { tenantId: session.tenantId } }),
      prismaAny.$runCommandRaw({ find: "Department", filter: { tenantId: session.tenantId } }),
      prismaAny.$runCommandRaw({ find: "department", filter: { tenantId: session.tenantId } })
    ]);

    // Merge results from different casing possibilities
    const depts1 = rawDepts1.cursor?.firstBatch || [];
    const depts2 = rawDepts2.cursor?.firstBatch || [];
    
    // Combine and normalize IDs (converting _id.$oid or _id string to a flat 'id')
    const combinedDepts = [...depts1, ...depts2].map((d: any) => ({
      id: d.id || (typeof d._id === 'object' ? d._id.$oid : d._id),
      name: d.name
    }));

    // Remove duplicates by ID
    const departments = Array.from(new Map(combinedDepts.map(item => [item.id, item])).values());

    return NextResponse.json({ roles, departments });
  } catch (error) {
    console.error("SETUP DATA FAIL:", error);
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}
