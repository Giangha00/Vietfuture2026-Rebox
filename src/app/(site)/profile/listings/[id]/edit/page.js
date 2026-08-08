import EditListingForm from "@/components/profile/EditListingForm";

export const metadata = {
  title: "Edit Listing",
};

export default async function EditListingPage({ params }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-sans text-3xl font-bold text-rb-ink">
        Edit listing
      </h1>
      <EditListingForm productId={id} />
    </div>
  );
}
