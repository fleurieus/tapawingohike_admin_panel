"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {ChevronDown, ChevronRight, ChevronUp, Home} from "lucide-react";
import {Organisation} from "@/types/organisation";
import {Event} from "@/types/event";
import {Edition} from "@/types/edition";
import apiClientClient from "@/lib/apiClientClient";

const Sidebar: React.FC = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchOrganisations();
  }, []);

  const fetchOrganisations = async () => {
    try {
      const response = await apiClientClient.get("/organisations");
      const data = response.data;
      const initialIsOpenState: { [key: string]: boolean } = {};
      data.forEach((org: Organisation) => {
        initialIsOpenState[`org-${org.id}`] = false;
      });
      setOrganisations(data);
      setIsOpen(initialIsOpenState);
    } catch (error) {
      console.error("Error fetching organisations:", error);
    }
  };

  const toggleOpen = async (id: number, level: string) => {
    try {
      const updatedIsOpen = { ...isOpen };
      const key = generateToggleKey(id, level);
      updatedIsOpen[key] = !updatedIsOpen[key];
      setIsOpen(updatedIsOpen);

      if (updatedIsOpen[key]) {
        switch (level) {
          case "organisation":
            await fetchOrganisationEvents(id);
            break;
          case "event":
            await fetchEventEditions(id);
            break;
          case "edition":
            await fetchEditionRoutes(id);
            break;
          case "route":
            await fetchRouteRouteparts(id);
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error(`Error toggling open for id ${id} and level ${level}:`, error);
    }
  };

  const generateToggleKey = (id: number, level: string): string => {
    switch (level) {
      case "organisation":
        return `org-${id}`;
      case "event":
        return `event-${id}`;
      case "edition":
        return `edition-${id}`;
      case "route":
        return `route-${id}`;
      default:
        return `${level}-${id}`;
    }
  };

  const fetchOrganisationEvents = async (orgId: number) => {
    try {
      const response = await apiClientClient.get(`/organisations/${orgId}/events`);
      const data = response.data;
      const updatedOrganisations = organisations.map((org) =>
          org.id === orgId ? { ...org, events: data } : org
      );
      setOrganisations(updatedOrganisations);
    } catch (error) {
      console.error(`Error fetching events for organisation ${orgId}:`, error);
    }
  };

  const fetchEventEditions = async (eventId: number) => {
    try {
      const response = await apiClientClient.get(`/events/${eventId}/editions`);
      const data = response.data;
      const updatedOrganisations = organisations.map((org) => ({
        ...org,
        events: org.events?.map((event) =>
            event.id === eventId ? { ...event, editions: data } : event
        ),
      }));
      setOrganisations(updatedOrganisations);
    } catch (error) {
      console.error(`Error fetching editions for event ${eventId}:`, error);
    }
  };

  const fetchEditionRoutes = async (editionId: number) => {
    try {
      const response = await apiClientClient.get(`/editions/${editionId}/routes`);
      const data = response.data;
      const updatedOrganisations = organisations.map((org) => ({
        ...org,
        events: org.events?.map((event) => ({
          ...event,
          editions: event.editions?.map((edition) =>
              edition.id === editionId ? { ...edition, routes: data } : edition
          ),
        })),
      }));
      setOrganisations(updatedOrganisations);
    } catch (error) {
      console.error(`Error fetching routes for edition ${editionId}:`, error);
    }
  };

  const fetchRouteRouteparts = async (routeId: number) => {
    try {
      const response = await apiClientClient.get(`/routes/${routeId}/routeparts`);
      const data = response.data;
      const updatedOrganisations = organisations.map((org) => ({
        ...org,
        events: org.events?.map((event) => ({
          ...event,
          editions: event.editions?.map((edition) => ({
            ...edition,
            routes: edition.routes?.map((route) =>
                route.id === routeId ? { ...route, routeparts: data } : route
            ),
          })),
        })),
      }));
      setOrganisations(updatedOrganisations);
    } catch (error) {
      console.error(`Error fetching routeparts for route ${routeId}:`, error);
    }
  };

  return (
      <aside className="h-full min-h-0 bg-tapawingo_green text-white border-r overflow-y-auto">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center h-14 border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-white">
              <span>Tapawingo Hike</span>
            </Link>
          </div>
          <div className="flex-1 text-white">
            <nav className="px-2 text-sm font-medium lg:px-4">
              {organisations.map((org: Organisation) => (
                  <div key={org.id} className="py-2">
                    <button
                        onClick={() => toggleOpen(org.id!, "organisation")}
                        className="flex items-center gap-2 w-full text-left"
                    >
                      <Home className="h-4 w-4" />
                      <span>{org.name}</span>
                      {isOpen[`org-${org.id}`] ? (
                          <ChevronUp className="ml-auto h-4 w-4" />
                      ) : (
                          <ChevronDown className="ml-auto h-4 w-4" />
                      )}
                    </button>
                    {isOpen[`org-${org.id}`] && (
                        <div className="pl-4">
                          {org.events?.length > 0 ? (
                              org.events.map((event: Event) => (
                                  <div key={event.id}>
                                    <button
                                        onClick={() => toggleOpen(event.id!, "event")}
                                        className="flex items-center gap-2 w-full text-left"
                                    >
                                      <ChevronRight className="h-4 w-4" />
                                      <Link href={`/organisations/${org.id}/events/${event.id}/editions`}>
                                        <span>{event.name}</span>
                                      </Link>
                                    </button>
                                    {isOpen[`event-${event.id}`] && (
                                        <div className="pl-4">
                                          {event.editions?.length > 0 ? (
                                              event.editions.map((edition: Edition) => (
                                                  <div key={edition.id}>
                                                    <button
                                                        onClick={() => toggleOpen(edition.id!, "edition")}
                                                        className="flex items-center gap-2 w-full text-left"
                                                    >
                                                      <ChevronRight className="h-4 w-4" />
                                                      <Link
                                                          href={`/organisations/${org.id}/events/${event.id}/editions/${edition.id}/routes`}
                                                      >
                                                        <span>{edition.name}</span>
                                                      </Link>
                                                    </button>
                                                    {isOpen[`edition-${edition.id}`] && (
                                                        <div className="pl-4">
                                                          {edition.routes!.length > 0 ? (
                                                              edition.routes?.map((route) => (
                                                                  <div key={route.id}>
                                                                    <button
                                                                        onClick={() => toggleOpen(route.id!, "route")}
                                                                        className="flex items-center gap-2 w-full text-left"
                                                                    >
                                                                      <ChevronRight className="h-4 w-4" />
                                                                      <Link
                                                                          href={`/organisations/${org.id}/events/${event.id}/editions/${edition.id}/routes/${route.id}/routeparts`}
                                                                      >
                                                                        <span>{route.name}</span>
                                                                      </Link>
                                                                    </button>
                                                                    {isOpen[`route-${route.id}`] && (
                                                                        <div className="pl-4">
                                                                          {route.routeparts!.length > 0 ? (
                                                                              route.routeparts?.map((routepart) => (
                                                                                  <div key={routepart.id}>
                                                                                    <Link
                                                                                        href={`/organisations/${org.id}/events/${event.id}/editions/${edition.id}/routes/${route.id}/routeparts`}
                                                                                    >
                                                                                      <span>{routepart.name}</span>
                                                                                    </Link>
                                                                                  </div>
                                                                              ))
                                                                          ) : (
                                                                              <div className="pl-4">No routeparts available</div>
                                                                          )}
                                                                        </div>
                                                                    )}
                                                                  </div>
                                                              ))
                                                          ) : (
                                                              <div className="pl-4">No routes available</div>
                                                          )}
                                                        </div>
                                                    )}
                                                  </div>
                                              ))
                                          ) : (
                                              <div className="pl-4">No editions available</div>
                                          )}
                                        </div>
                                    )}
                                  </div>
                              ))
                          ) : (
                              <div className="pl-4">No events available</div>
                          )}
                        </div>
                    )}
                  </div>
              ))}
            </nav>
          </div>
        </div>
      </aside>
  );
};

export default Sidebar;
