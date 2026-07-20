import PostItemForm from "@/components/post-item/PostItemForm";
import PostItemGuard from "@/components/auth/PostItemGuard";

export const metadata = {
  title: "Post Item",
};

export default function PostItemPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-rb-ink">
          Post an Item
        </h1>
        <p className="mt-2 text-rb-muted">
          List in minutes. Escrow and station drop-off keep the trade silent and
          secure.
        </p>
      </div>
      <PostItemGuard>
        <PostItemForm />
      </PostItemGuard>
    </div>
  );
}
