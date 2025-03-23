import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Heart,
  ArrowRight,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import HeroStats from "./HeroStats";

const HeroSection = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  // Animation trigger
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div className="relative bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left column - Text content - Takes 5/12 of the grid */}
          <div
            className={cn(
              "lg:col-span-5 transition-all duration-1000 ease-out text-center lg:text-left",
              isAnimated
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            )}
          >
            <Badge
              className="mb-4 text-xs font-semibold px-3 py-1 bg-primary/10 text-primary border-primary/20 mx-auto lg:mx-0 inline-flex items-center gap-1.5"
              variant="outline"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Every Drop Counts
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              <span className="text-primary text-glow-primary">Connecting</span> Blood{" "}
              <br className="hidden md:block" />
              Donors with <span className="text-primary text-glow-primary">Lives</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Bangladesh's premier blood donation network connecting those in
              need with verified donors. Fast, reliable, and life-saving
              connections when every minute matters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center lg:justify-start">
              <Link to="/find-donors" className="w-full sm:w-auto">
                <Button size="lg" className="w-full group bg-primary hover:bg-primary/90 shadow-glow">
                  <Search className="mr-2 h-5 w-5" />
                  Find a Donor
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link to="/request-blood" className="sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full border-primary/20 text-primary hover:bg-primary/10 hover:text-white"
                >
                  <Activity className="mr-2 h-5 w-5" />
                 Emergency Request
                </Button>
              </Link>
            </div>

            <div className="mt-6 border-t border-primary/10 pt-6">
              <p className="text-sm text-gray-400 mb-2">
                "A single donation can save up to three lives.{" "}
                <Link to="/register-donor">
                  <span className="text-primary underline font-semibold hover:text-primary/80">
                    By becoming a blood donor{" "}
                  </span>
                </Link>
                ,you join a community of heroes who make a real difference every
                day."
              </p>
            </div>
          </div>

          {/* Right column - Stats component - Takes 7/12 of the grid */}
          <div
            className={cn(
              "lg:col-span-7 transition-all duration-1000 ease-out",
              isAnimated
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            )}
          >
            <HeroStats />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
