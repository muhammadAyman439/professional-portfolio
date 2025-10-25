import { Button } from "@/components/ui/button";
import { Mail, Linkedin, ArrowRight } from "lucide-react";
import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { pageSEO } from "@/lib/seo";
import { profile } from "@/data/profile";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="w-full">
      <SEOHead metadata={pageSEO.contact} path="/contact" />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

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
                  <h3 className="text-xl font-semibold text-primary mb-2">Thank You!</h3>
                  <p className="text-foreground/70">
                    Your message has been received. I'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Your name"
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
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-semibold group"
                  >
                    Send Message
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
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

          <div className="space-y-6">
            <details className="group border border-foreground/10 rounded-lg p-6 cursor-pointer hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between font-semibold text-lg">
                <span>What services do you offer?</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-foreground/70">
                I offer proposal strategy consulting, team leadership development, compliance excellence training, and mentoring for proposal professionals. I work with organizations of all sizes across government, enterprise, and technology sectors.
              </p>
            </details>

            <details className="group border border-foreground/10 rounded-lg p-6 cursor-pointer hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between font-semibold text-lg">
                <span>How do you approach proposal strategy?</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-foreground/70">
                I start with deep analysis of the opportunity and competitive landscape. Then I develop a positioning strategy that differentiates your organization and addresses key evaluation criteria. Finally, I help execute with rigor and excellence across all compliance and narrative elements.
              </p>
            </details>

            <details className="group border border-foreground/10 rounded-lg p-6 cursor-pointer hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between font-semibold text-lg">
                <span>What's your availability for consulting?</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-foreground/70">
                I work with a limited number of clients to ensure quality and focus. I typically take on 2-3 engagements per year. Contact me to discuss your needs and timeline.
              </p>
            </details>

            <details className="group border border-foreground/10 rounded-lg p-6 cursor-pointer hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between font-semibold text-lg">
                <span>Do you offer speaking engagements?</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-foreground/70">
                Yes, I regularly speak at industry conferences and corporate events on proposal strategy, leadership, and business development. I'm happy to discuss speaking opportunities.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}

