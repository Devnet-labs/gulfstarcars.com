import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { PageContentWrapper } from "@/components/PageContentWrapper";

export default function SiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <Analytics />
            <PageContentWrapper>
                {children}
            </PageContentWrapper>
            <Footer />
        </>
    );
}
