import Button from "@/components/ui/Button";

export default function SocialAuth() {
  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-wider text-rb-muted">
        <span className="h-px flex-1 bg-rb-border" />
        Or continue with
        <span className="h-px flex-1 bg-rb-border" />
      </div>
      <Button variant="secondary" type="button" fullWidth>
        <span className="font-bold text-[#4285F4]">G</span> Log in with Google
      </Button>
    </div>
  );
}
