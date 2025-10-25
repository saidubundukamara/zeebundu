import { NextRequest, NextResponse } from "next/server";
import { MediaRepository } from "@/lib/repositories/MediaRepository";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    const type = searchParams.get("type");
    const tags = searchParams.get("tags");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");

    const mediaRepository = new MediaRepository();

    if (search) {
      const results = await mediaRepository.searchMedia(
        search,
        businessId || undefined
      );
      return NextResponse.json({
        success: true,
        data: results,
        total: results.length,
      });
    }

    const filters = {
      businessId: businessId || undefined,
      type: type || undefined,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : undefined,
      limit,
      skip,
    };

    const media = await mediaRepository.getMediaByFilters(filters);

    // Get total count for pagination
    const { limit: _, skip: __, ...totalFilters } = filters;
    const allMedia = await mediaRepository.getMediaByFilters(totalFilters);

    return NextResponse.json({
      success: true,
      data: media,
      total: allMedia.length,
      pagination: {
        limit,
        skip,
        hasMore: skip + limit < allMedia.length,
      },
    });
  } catch (error) {
    console.error("Media fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch media",
      },
      { status: 500 }
    );
  }
}
