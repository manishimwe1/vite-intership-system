import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Clock,
  User,
  Calendar,
  ChevronLeft,
  Share2,
  Heart,
  Download,
  CheckCircle,
  BookOpen,
  Award,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${id}`);
      const data = await response.json();

      if (data.success) {
        setCourse(data.data);
      } else {
        setError("Course not found");
      }
    } catch (err) {
      setError("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0`
      : null;
  };

  // Extract Vimeo video ID from URL
  const getVimeoEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /vimeo\.com\/(?:video\/)?(\d+)/;
    const match = url.match(regExp);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  };

  const getVideoEmbedUrl = (url) => {
    return getYouTubeEmbedUrl(url) || getVimeoEmbedUrl(url) || url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton header */}
          <div className="h-8 w-32 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>

          {/* Skeleton video */}
          <div className="aspect-video bg-gray-200 rounded-2xl mb-6 animate-pulse"></div>

          {/* Skeleton content */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Course not found"}
          </h2>
          <p className="text-gray-500 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const embedUrl = getVideoEmbedUrl(course.videoSrc);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Courses</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2.5 rounded-xl border transition-all ${
                isLiked
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Video Player */}
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-8">
          <div className="aspect-video relative">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={course.name}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Video not available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {course.tag}
                  </span>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {course.name}
                  </h1>
                </div>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                )}
                {course.instructor && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{course.instructor}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(course.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100">
                <div className="flex">
                  {["overview", "curriculum", "resources"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium capitalize transition-colors border-b-2 ${
                        activeTab === tab
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        About this course
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* What you'll learn */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        What you'll learn
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          "Master core concepts",
                          "Hands-on projects",
                          "Industry best practices",
                          "Certificate of completion",
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Course Content
                    </h3>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      {[1, 2, 3].map((module, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-4 ${
                            index !== 2 ? "border-b border-gray-100" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
                              {module}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Module {module}: Introduction
                              </p>
                              <p className="text-sm text-gray-500">
                                3 lessons • 45 min
                              </p>
                            </div>
                          </div>
                          <Play className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Downloadable Resources
                    </h3>
                    <div className="space-y-2">
                      {[
                        "Course Slides (PDF)",
                        "Source Code (ZIP)",
                        "Cheat Sheet (PDF)",
                      ].map((resource, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-indigo-600" />
                            <span className="font-medium text-gray-900">
                              {resource}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">2.4 MB</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <button className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mb-4">
                <Play className="w-5 h-5" />
                Continue Learning
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate(`/edit-course/${course._id}`)}
                  className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 py-2.5 border border-red-200 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>

            {/* Instructor Card */}
            {course.instructor && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Instructor
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {course.instructor.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {course.instructor}
                    </p>
                    <p className="text-sm text-gray-500">Senior Instructor</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Course Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-600">Lessons</span>
                  </div>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-600">Duration</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {course.duration || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-600">Certificate</span>
                  </div>
                  <span className="font-semibold text-gray-900">Yes</span>
                </div>
              </div>
            </div>

            {/* Related Courses */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">
                Related Courses
              </h3>
              <div className="space-y-4">
                {[1, 2].map((_, index) => (
                  <div
                    key={index}
                    className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors"
                    onClick={() => navigate("/")}
                  >
                    <div className="w-20 h-14 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm line-clamp-2">
                        Advanced {course.tag} Techniques
                      </p>
                      <p className="text-xs text-gray-500 mt-1">4.8 ★</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
