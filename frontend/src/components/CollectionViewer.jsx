function collectColumns(documents) {
  const seen = new Set();

  documents.forEach((document) => {
    Object.keys(document || {}).forEach((key) => {
      if (!seen.has(key)) {
        seen.add(key);
      }
    });
  });

  return Array.from(seen);
}

function formatValue(value) {
  if (value === null || value === undefined) {
    return "null";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.length ? JSON.stringify(value) : "[]";
  }

  if (typeof value === "object") {
    if (value._id && value.name) {
      return `${value.name} (${value._id})`;
    }

    if (value._id) {
      return value._id;
    }

    return JSON.stringify(value);
  }

  return String(value);
}

export default function CollectionViewer({ title, documents }) {
  const columns = collectColumns(documents);

  return (
    <section
      style={{
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
        overflow: "hidden"
      }}
    >
      <div style={{ padding: 24, borderBottom: "1px solid var(--line)" }}>
        <p style={{ margin: 0, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12 }}>
          Collection Viewer
        </p>
        <h3 style={{ margin: "8px 0 0" }}>{title}</h3>
      </div>

      {documents.length === 0 ? (
        <p style={{ margin: 0, padding: 24, color: "var(--muted)" }}>No documents available.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
            <thead>
              <tr style={{ background: "rgba(89, 213, 255, 0.08)" }}>
                {columns.map((column) => (
                  <th
                    key={column}
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid var(--line)",
                      color: "var(--text)",
                      fontSize: 13,
                      whiteSpace: "nowrap"
                    }}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.map((document, index) => (
                <tr key={document?._id || `${title}-${index}`} style={{ borderBottom: "1px solid var(--line)" }}>
                  {columns.map((column) => (
                    <td
                      key={`${document?._id || index}-${column}`}
                      style={{
                        padding: "14px 16px",
                        verticalAlign: "top",
                        color: column === "_id" ? "var(--accent)" : "var(--text)",
                        fontSize: 13,
                        lineHeight: 1.45,
                        maxWidth: 260,
                        wordBreak: "break-word"
                      }}
                    >
                      {formatValue(document?.[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
