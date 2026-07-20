import Button from "@/components/ui/Button";

export default function SocialAuth() {
  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-3 text-xs text-rb-muted">
        <span className="h-px flex-1 bg-rb-border" />
        Or continue with
        <span className="h-px flex-1 bg-rb-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" type="button">
          <span className="font-bold text-[#4285F4]">G</span> Google
        </Button>
        <Button variant="secondary" type="button">
          <span className="font-bold text-[#1877F2]">f</span> Facebook
        </Button>
      </div>
    </div>
  );
}
