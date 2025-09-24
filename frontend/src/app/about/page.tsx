export default function AboutPage() {
  const sections = [
    {
      title: "Mission",
      points: [
        "Provide high-quality medical equipment for clinics and laboratories.",
        "Ensure safe and effective use of all medical devices.",
        "Offer professional training and support for our clients.",
      ],
      icon: "🎯", // optional icon
    },
    {
      title: "Vision",
      points: [
        "Make healthcare more accessible and efficient through reliable technology.",
        "Become a leading provider of innovative medical solutions.",
        "Continuously improve our products and services to meet global standards.",
      ],
      icon: "🌟",
    },
    {
      title: "Certifications",
      points: [
        "Certified by national medical equipment standards organizations.",
        "Compliant with international medical device regulations.",
        "Regularly audited to maintain high-quality standards.",
      ],
      icon: "🏅",
    },
  ];

  return (
    <section className="px-4 py-12 max-w-6xl mt-10 mx-auto">

      <h1 className="text-3xl font-bold  text-black mb-8">About Us</h1>
      
    <div className="px-4 py-12 max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
      
      {sections.map((section) => (
        <div
          key={section.title}
          className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">{section.icon}</span>
            <h2 className="text-xl text-black font-semibold">{section.title}</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {section.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div></section>
  );
}
