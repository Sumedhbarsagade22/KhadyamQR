export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="container h-14 flex items-center justify-between border-b">
        <div className="flex items-center gap-2 font-extrabold tracking-tight">
          <img src="/khadyamqr-logo.svg" alt="KhadyamQR logo" className="h-8 w-8 rounded" />
          <span>KhadyamQR</span>
        </div>
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Home</a>
      </header>

      <main className="container py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-emerald max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p>KhadyamQR collects the following information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Email addresses and passwords for admin and restaurant owner accounts</li>
              <li><strong>Restaurant Data:</strong> Restaurant names, logos, menu items, descriptions, prices, and images</li>
              <li><strong>Usage Data:</strong> Information about how you use our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain the KhadyamQR service</li>
              <li>Generate and manage QR codes for restaurant menus</li>
              <li>Allow restaurant owners to manage their menu items</li>
              <li>Improve and optimize our service</li>
              <li>Communicate with you about service updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
            <p>Your data is stored securely using Supabase infrastructure:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All data is encrypted in transit using HTTPS</li>
              <li>Passwords are hashed and never stored in plain text</li>
              <li>Database access is protected with Row Level Security (RLS)</li>
              <li>Images are stored in secure cloud storage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
            <p>We do not sell or share your personal information with third parties, except:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Public menu pages are accessible to anyone with the URL</li>
              <li>Service providers (Supabase) who help us operate the platform</li>
              <li>When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
            <p>We use essential cookies to maintain your login session. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
            <p>Our service is not intended for children under 13. We do not knowingly collect information from children.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p>If you have questions about this privacy policy, please contact us:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: privacy@khadyamqr.com</li>
              <li>Contact Form: <a href="/contact" className="text-primary hover:underline">/contact</a></li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="container py-10 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} KhadyamQR. All rights reserved.
      </footer>
    </div>
  );
}
