declare module 'tz-lookup' {
  /**
   * Returns the IANA timezone identifier (e.g. "Asia/Jakarta") for a
   * given latitude/longitude pair. Pure offline lookup, no network call.
   */
  export default function tzlookup(lat: number, lon: number): string;
}
