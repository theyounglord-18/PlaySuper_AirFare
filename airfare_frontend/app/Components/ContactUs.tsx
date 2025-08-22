import { Linkedin, Instagram, Facebook, MapPin } from "lucide-react";

const ContactUs = () => {
  const socialLinks = [
    { Icon: Linkedin, href: "https://linkedin.com", name: "LinkedIn" },
    { Icon: Instagram, href: "https://instagram.com", name: "Instagram" },
    { Icon: Facebook, href: "https://facebook.com", name: "Facebook" },
  ];

  return (
    <footer id="contact" className="bg-black text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Get In Touch</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-8">
          We're here to help with your travel needs. While we don't offer direct
          support via forms, you can find us at our office or connect with us on
          social media.
        </p>

        <div className="flex justify-center items-center gap-3 text-lg mb-8">
          <MapPin className="text-blue-400" />
          <span>Hyderabad, Telangana, India</span>
        </div>

        <div className="flex justify-center gap-6 mb-12">
          {socialLinks.map(({ Icon, href, name }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-800/50 border border-slate-700 rounded-full text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
              title={name}
            >
              <Icon size={24} />
            </a>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} FlyRoute. All Rights Reserved. A
            world-class flight finding experience.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ContactUs;
