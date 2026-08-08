import PostItemForm from "@/components/post-item/PostItemForm";
import PostItemGuard from "@/components/auth/PostItemGuard";

export const metadata = {
  title: "Post Item",
};

export default function PostItemPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <PostItemGuard>
        <PostItemForm />
      </PostItemGuard>
    </div>
  );
}
