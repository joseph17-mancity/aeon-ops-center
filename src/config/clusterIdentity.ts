/**
 * ─────────────────────────────────────────────────────────────
 *  AEON · CLUSTER IDENTITY (edit me)
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for the cluster name, regions and node
 * IDs shown across every view. Rename the cluster, rename or add
 * regions, add/remove nodes — the header, failover map, topology
 * inventory and memory rollups all follow automatically.
 */

export type RegionRole = "primary" | "failover" | "replica";

export type RegionConfig = {
  /** Cloud region identifier, e.g. "us-east-1" */
  id: string;
  /** Label shown in the UI (defaults to the id) */
  label?: string;
  role: RegionRole;
  /** Position on the failover map SVG (viewBox 520x200) */
  mapX: number;
  mapY: number;
};

export type NodeConfig = {
  /** CockroachDB node id */
  id: number;
  /** Hostname prefix — address becomes `${host}.${region}:26257` */
  host: string;
  region: string;
  az: string;
  status: "live" | "degraded" | "down";
  ranges: number;
  leases: number;
  cpu: string;
  liveBytes: string;
  vectorRows: string;
  replicationLag: string;
};

export const CLUSTER = {
  /** Cluster name shown in the header and CLI commands */
  name: "aeon-prod-brain",
  organization: "Aeon SRE Platform",
  plan: "CockroachDB Cloud · Dedicated Multi-Region",
  crdbVersion: "v24.3.4",
  cliVersion: "v34.0.0 (API v2)",

  regions: [
    { id: "us-east-1", role: "primary", mapX: 232, mapY: 84 },
    { id: "us-west-2", role: "failover", mapX: 118, mapY: 96 },
    { id: "eu-central-1", role: "replica", mapX: 392, mapY: 74 },
  ] as RegionConfig[],

  nodes: [
    {
      id: 1,
      host: "aeon-crdb-1",
      region: "us-east-1",
      az: "us-east-1a",
      status: "live",
      ranges: 4182,
      leases: 1394,
      cpu: "0.41",
      liveBytes: "412 GiB",
      vectorRows: "1,284,904",
      replicationLag: "1.2 ms",
    },
    {
      id: 2,
      host: "aeon-crdb-2",
      region: "us-east-1",
      az: "us-east-1b",
      status: "degraded",
      ranges: 4180,
      leases: 902,
      cpu: "0.78",
      liveBytes: "410 GiB",
      vectorRows: "1,284,904",
      replicationLag: "4.9 ms",
    },
    {
      id: 3,
      host: "aeon-crdb-3",
      region: "us-west-2",
      az: "us-west-2a",
      status: "live",
      ranges: 4181,
      leases: 1421,
      cpu: "0.33",
      liveBytes: "411 GiB",
      vectorRows: "1,284,904",
      replicationLag: "1.8 ms",
    },
    {
      id: 4,
      host: "aeon-crdb-4",
      region: "us-west-2",
      az: "us-west-2c",
      status: "live",
      ranges: 4179,
      leases: 1188,
      cpu: "0.29",
      liveBytes: "409 GiB",
      vectorRows: "1,284,903",
      replicationLag: "2.1 ms",
    },
    {
      id: 5,
      host: "aeon-crdb-5",
      region: "eu-central-1",
      az: "eu-central-1a",
      status: "live",
      ranges: 4183,
      leases: 1104,
      cpu: "0.36",
      liveBytes: "413 GiB",
      vectorRows: "1,284,901",
      replicationLag: "34.6 ms",
    },
    {
      id: 6,
      host: "aeon-crdb-6",
      region: "eu-central-1",
      az: "eu-central-1b",
      status: "live",
      ranges: 4177,
      leases: 986,
      cpu: "0.31",
      liveBytes: "408 GiB",
      vectorRows: "1,284,901",
      replicationLag: "35.8 ms",
    },
  ] as NodeConfig[],
};

export const regionLabel = (r: RegionConfig) => r.label ?? r.id;

export const REGION_IDS = CLUSTER.regions.map((r) => r.id);

export const PRIMARY_REGION =
  CLUSTER.regions.find((r) => r.role === "primary")?.id ?? REGION_IDS[0] ?? "us-east-1";

export const FAILOVER_REGION =
  CLUSTER.regions.find((r) => r.role === "failover")?.id ?? REGION_IDS[1] ?? PRIMARY_REGION;
