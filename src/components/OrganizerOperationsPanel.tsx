import { useState } from "react";
import { CheckCircle2, ExternalLink, FileUp, KeyRound, LoaderCircle, ShieldCheck, TriangleAlert } from "lucide-react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { OrganizerFileLibrary } from "@/components/OrganizerFileLibrary";
import "@/participant-persistence.css";
import "@/participant-persistence-actions.css";

const MAX_FILE_BYTES = 3_000_000;

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The selected file could not be read"));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return reject(new Error("The selected file could not be encoded"));
      resolve(result.split(",")[1] ?? "");
    };
    reader.readAsDataURL(file);
  });
}

type StoredFile = { id: number; originalName: string; byteSize: number; createdAt: Date };

function StoredFileRow({ file }: { file: StoredFile }) {
  const accessFile = trpc.fileUploads.getMine.useQuery({ id: file.id }, { enabled: false, retry: false });
  const openFile = async () => {
    const result = await accessFile.refetch();
    if (result.data?.url) window.open(result.data.url, "_blank", "noopener,noreferrer");
  };
  return <li><span>{file.originalName}</span><small>{(file.byteSize / 1024).toFixed(1)} KB · {new Date(file.createdAt).toLocaleDateString()}</small><button type="button" className="organizer-operations__file-open" onClick={() => void openFile()} disabled={accessFile.isFetching}>{accessFile.isFetching ? "Preparing…" : <><ExternalLink size={13} /> Open</>}</button>{accessFile.isError && <small className="organizer-operations__file-error">File access unavailable. Please try again.</small>}</li>;
}

export default function OrganizerOperationsPanel() {
  const { user, loading, isAuthenticated } = useAuth();
  const [notice, setNotice] = useState("");
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();
  const uploads = trpc.fileUploads.mine.useQuery(undefined, { enabled: isAdmin });
  const upload = trpc.fileUploads.uploadOrganizerReference.useMutation({
    onSuccess: async () => {
      setNotice("The organizer reference file has been stored.");
      await utils.fileUploads.mine.invalidate();
    },
    onError: error => setNotice(error.message),
  });

  const handleFileUpload = async (file?: File) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setNotice("Choose a file no larger than 3 MB.");
      return;
    }
    if (!["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setNotice("Only PDF, JPEG, PNG, and WEBP organizer reference files are supported.");
      return;
    }
    try {
      await upload.mutateAsync({
        originalName: file.name,
        contentType: file.type as "application/pdf" | "image/jpeg" | "image/png" | "image/webp",
        dataBase64: await readFileAsBase64(file),
      });
    } catch {
      // The mutation error is surfaced through the shared notice state.
    }
  };

  return <section className="organizer-operations" aria-labelledby="organizer-operations-heading"><div className="container organizer-operations__grid"><div className="organizer-operations__intro"><p className="section-kicker"><ShieldCheck size={13} /> Organizer reference files</p><h2 id="organizer-operations-heading">Keep field notes protected.</h2><p>The Supabase QR scanner above is the authoritative organizer verification and check-in flow. This separate panel manages protected organizer reference files only; it does not write attendance data.</p></div>{loading ? <div className="organizer-operations__panel"><LoaderCircle className="is-spinning" size={18} /> Reading organizer access…</div> : !isAuthenticated ? <div className="organizer-operations__panel"><KeyRound size={18} /><h3>Administrator sign-in required</h3><p>Use the secure sign-in route to access organizer reference files.</p><button type="button" className="button-primary" onClick={startLogin}>Sign in securely</button></div> : !isAdmin ? <div className="organizer-operations__panel"><TriangleAlert size={18} /><h3>Administrator access required</h3><p>This signed-in account is not assigned the organizer administrator role.</p></div> : <div className="organizer-operations__workspace"><div className="organizer-operations__panel"><p className="section-kicker">Managed reference files</p><h3>Store an organizer file.</h3><p>PDF, JPEG, PNG, or WEBP only; maximum 3 MB. File bytes are stored separately from the database, which retains the protected metadata reference.</p><label className="organizer-operations__file"><FileUp size={17} /><span>{upload.isPending ? "Storing file…" : "Select a reference file"}</span><input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={event => void handleFileUpload(event.target.files?.[0])} disabled={upload.isPending} /></label><OrganizerFileLibrary isLoading={uploads.isLoading} files={uploads.data ?? []} renderFile={file => <StoredFileRow key={file.id} file={file} />}/></div></div>}{notice && <p className={`organizer-operations__notice ${upload.isError ? "is-error" : ""}`} aria-live="polite"><CheckCircle2 size={15} /> {notice}</p>}</div></section>;
}
