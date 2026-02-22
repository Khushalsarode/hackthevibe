import React, { useState } from "react";

const DomainStatus = () => {
  const [domainName, setDomainName] = useState("");
  const [domainInfo, setDomainInfo] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const Domain_check_key = import.meta.env.VITE_DOMAIN_CHECK_KEY;

  const fetchDomainInfo = async () => {
    setError("");
    setDomainInfo(null);
    setIsAvailable(false);

    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

    if (!domainRegex.test(domainName)) {
      setError("Please enter a valid domain name (e.g., example.com)");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${Domain_check_key}&domainName=${domainName}&outputFormat=json`
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const whois = data?.WhoisRecord;
      const registrant = whois?.registryData?.registrant;

      if (whois && whois.registryData) {
        if (registrant) {
          setDomainInfo(whois);
          setIsAvailable(false);
        } else {
          setIsAvailable(true);
        }
      } else {
        setIsAvailable(true);
      }
    } catch (err) {
      setError("Failed to fetch domain info: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            🔍 Domain Status Checker
          </h1>
          <p className="text-slate-400">
            Instantly check if your desired domain is available.
          </p>
        </div>

        {/* Input Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter domain (e.g., example.com)"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={fetchDomainInfo}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 px-8 py-4 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Available Card */}
        {isAvailable && (
          <div className="bg-emerald-500/10 border border-emerald-500 rounded-2xl p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-emerald-400">
              🟢 Domain Available!
            </h2>
            <p>
              The domain <strong>{domainName}</strong> is currently not registered.
            </p>
            <p className="text-slate-400">
              You can register it before someone else does!
            </p>
          </div>
        )}

        {/* Taken Card */}
        {domainInfo && (
          <div className="bg-red-500/10 border border-red-500 rounded-2xl p-8 space-y-8">

            <div className="text-center text-red-400 font-semibold text-lg">
              ❌ This domain is already registered
            </div>

            {/* Domain Info */}
            <div className="grid md:grid-cols-2 gap-8">
              <InfoBlock
                title="🌐 Domain Info"
                items={[
                  ["Domain", domainInfo.domainName],
                  ["Registrar", domainInfo.registrarName || "REDACTED"],
                  ["IANA ID", domainInfo.registrarIANAID || "REDACTED"],
                  [
                    "Created",
                    domainInfo.registryData?.createdDate
                      ? new Date(
                          domainInfo.registryData.createdDate
                        ).toLocaleString()
                      : "N/A",
                  ],
                  [
                    "Updated",
                    domainInfo.registryData?.updatedDate
                      ? new Date(
                          domainInfo.registryData.updatedDate
                        ).toLocaleString()
                      : "N/A",
                  ],
                  [
                    "Expires",
                    domainInfo.registryData?.expiresDate
                      ? new Date(
                          domainInfo.registryData.expiresDate
                        ).toLocaleString()
                      : "N/A",
                  ],
                ]}
              />

              {/* Registrant */}
              <InfoBlock
                title="👤 Registrant Info"
                items={
                  domainInfo.registryData?.registrant
                    ? [
                        ["Name", domainInfo.registryData.registrant.name || "Private"],
                        [
                          "Org",
                          domainInfo.registryData.registrant.organization ||
                            "Private by Design LLC",
                        ],
                        [
                          "Country",
                          domainInfo.registryData.registrant.country || "Private",
                        ],
                      ]
                    : [["Info", "Private or Not Available"]]
                }
              />
            </div>

            {/* Name Servers */}
            <div>
              <h2 className="text-xl font-semibold text-indigo-400 mb-4">
                🧭 Name Servers
              </h2>
              {domainInfo.registryData?.nameServers?.hostNames?.length > 0 ? (
                <ul className="grid md:grid-cols-2 gap-2 text-slate-300">
                  {domainInfo.registryData.nameServers.hostNames.map(
                    (ns, i) => (
                      <li
                        key={i}
                        className="bg-slate-800 px-4 py-2 rounded-lg"
                      >
                        {ns}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-slate-400">No name servers found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function InfoBlock({ title, items }) {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl space-y-3">
      <h2 className="text-lg font-semibold text-indigo-400 mb-2">
        {title}
      </h2>
      {items.map(([label, value], index) => (
        <p key={index} className="text-sm">
          <span className="font-medium text-slate-300">{label}:</span>{" "}
          <span className="text-slate-400">{value}</span>
        </p>
      ))}
    </div>
  );
}

export default DomainStatus;