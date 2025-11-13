import { Button } from "@/components/ui/button";
import { Mail, Linkedin, ArrowRight } from "lucide-react";
import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { buildPageSEO } from "@/lib/seo";
import { Spinner } from "@/components/ui/spinner";
import { useProfile, useFAQs } from "@/hooks/useContent";
import LottieAnimation from "@/components/LottieAnimation";
import apiClient from "@/api/http";
// animations loaded via CDN URLs using LottieAnimation `src`

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: profile, isLoading, isError } = useProfile();
  const { data: faqs, isLoading: faqsLoading } = useFAQs();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await apiClient.post("/email/contact", formData);

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      // Handle axios errors
      if (err.response) {
        const errorData = err.response.data;
        
        // Handle validation errors with detailed messages
        if (errorData?.details?.fieldErrors) {
          const fieldErrors = errorData.details.fieldErrors;
          const errorMessages: string[] = [];
          
          // Collect all field error messages
          if (fieldErrors.name?.length) errorMessages.push(...fieldErrors.name);
          if (fieldErrors.email?.length) errorMessages.push(...fieldErrors.email);
          if (fieldErrors.message?.length) errorMessages.push(...fieldErrors.message);
          
          setError(errorMessages.join(". ") || errorData.error || "Failed to send message");
        } else {
          setError(errorData?.error || `Failed to send message (${err.response.status})`);
        }
      } else if (err.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(err.message || "Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-foreground/60">
          <Spinner className="size-6" />
          <span>Loading contact details…</span>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-foreground/70">
          <p className="text-lg font-semibold">We couldn't load contact details.</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  const pageMetadata = buildPageSEO(profile).contact;

  return (
    <div className="w-full">
      <SEOHead metadata={pageMetadata} path="/contact" />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

        {/* Email - Client Communication */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-48 md:w-56 md:h-56 opacity-30 pointer-events-none float-slow-animation">
          <LottieAnimation src="https://assets7.lottiefiles.com/packages/lf20_8wREpI.json" speed={0.2} />
        </div>

        

        <div className="container relative z-10 max-w-4xl mx-auto px-4">
          <div className="text-center animate-fadeInUp">
            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6">
              Let's Connect
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              I'm always interested in discussing proposal strategy, leadership, and business development opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="animate-slideInLeft">
              <h2 className="text-3xl font-display font-bold mb-8">Get in Touch</h2>

              {/* Direct Contact */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60 mb-4">
                  Direct Contact
                </h3>
                <div className="space-y-4">
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-4 p-4 bg-foreground/2 rounded-lg hover:bg-foreground/5 transition-colors group"
                  >
                    <Mail className="text-primary flex-shrink-0" size={24} />
                    <div>
                      <p className="text-sm text-foreground/60">Email</p>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {profile.email}
                      </p>
                    </div>
                  </a>

                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-foreground/2 rounded-lg hover:bg-foreground/5 transition-colors group"
                  >
                    <Linkedin className="text-primary flex-shrink-0" size={24} />
                    <div>
                      <p className="text-sm text-foreground/60">LinkedIn</p>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        Connect on LinkedIn
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Response Time */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground/70">
                  <span className="font-semibold text-foreground">Response Time:</span> I typically respond to inquiries within 24-48 hours.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-slideInRight">
              <h2 className="text-3xl font-display font-bold mb-8">Send a Message</h2>

              {submitted ? (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 text-center">
                  <div className="w-32 h-32 mx-auto mb-4">
                    <LottieAnimation src="https://assets10.lottiefiles.com/packages/lf20_touohxv0.json" loop={false} speed={0.2} />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Thank You!</h3>
                  <p className="text-foreground/70">
                    Your message has been sent successfully. I'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Mohamed Salah Merza"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Tell me about your proposal challenges or opportunities..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-slate-900 dark:text-slate-950 py-3 font-semibold group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className="mr-2 size-5" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-foreground/2">
        <div className="container max-w-3xl">
          <h2 className="text-4xl font-display font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>

          {faqsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner className="size-8" />
            </div>
          ) : faqs && faqs.length > 0 ? (
            <div className="space-y-6">
              {faqs
                .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
                .map((faq) => (
                <details key={faq.id} className="group border border-foreground/10 rounded-lg p-6 cursor-pointer hover:border-primary/30 transition-colors">
                  <summary className="flex items-center justify-between font-semibold text-lg">
                    <span>{faq.question}</span>
                    <span className="transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-4 text-foreground/70">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-center text-foreground/60 py-12">No FAQs available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

