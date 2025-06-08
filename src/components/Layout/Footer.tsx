import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-6">
          <div>
            <h4 className="font-bold font-serif text-black mb-4 text-2xl">Mrowka.pl</h4>
            <p className="text-gray-600 mb-4">
              Poland's leading job portal connecting talent with opportunity.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-black mb-4">For Job Seekers</h5>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/jobs" className="hover:text-black transition-colors">Browse Jobs</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Career Advice</Link></li>
              <li><Link href="/profile" className="hover:text-black transition-colors">Upload CV</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Salary Guide</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-black mb-4">For Recruiters</h5>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="#" className="hover:text-black transition-colors">Post a Job</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Search CVs</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-black mb-4">Company</h5>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="#" className="hover:text-black transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <hr />
        <div className="flex flex-col py-6 md:flex-row justify-between items-center text-gray-600">
          <p>&copy; 2025 mrowka.pl. All rights reserved.</p>
          <p>Made with ❤️ in Poland</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
