import { Key } from "src/modules/keys-generator/intrerfaces/key.interface";
import { Keys } from "src/modules/keys-generator/schemas/key.schema";

export interface ParseArticle {
    vol: string;
    part: string;
    article: string;
}

interface Options {
    name: string;
    value: string;
}

interface GroupOptions {
    group_name: string;
    options: [Options]
}

interface SizeTable {
    details_props: [string]
    vaues: [any]
}

interface Selling {
    brand_name: string;
    supplier_id: number;
}

interface DataCardRoot {
    subject_id: number,
    subject_root_id: number,
    chrt_ids: [number]
}

export interface DataCard {
    imt_id: number,
    nm_id: number,
    imt_name: string,
    subj_name: string,
    subj_root_name: string,
    vendor_code: string,
    kinds: [string],
    description?: string,
    grouped_options: [GroupOptions],
    options: [Options],
    sizes_table: SizeTable,
    certificate: object,
    nm_colors_names: string,
    colors: [number],
    contents: string,
    full_colors: [object],
    selling: Selling,
    media: object,
    data: DataCardRoot,
}

export type KeyOptimazationData =  Key[] | [[Key]] | [Keys]
