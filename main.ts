/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

const cert_file = 'ca.crt';
const key_file = 'ca.key';

const cert = await Deno.readTextFile(cert_file).catch(() => '');
const key = await Deno.readTextFile(key_file).catch(() => '');

if (cert !== '' && key !== '')
    await start(manifest, {
        server: {
            cert: cert,
            key: key
        }
    });
else
    await start(manifest);
