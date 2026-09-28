const fs = require('fs');
const content = fs.readFileSync('src/components/NetflixRow.tsx', 'utf8');

const targetStr = `          {tracks.map((track, index) => {
            const isThisTrackPlaying = isPlaying && currentTrackIndex === index;
            const inMyList = myList.includes(track.id);
            return (
              <div
                key={track.id}
                onMouseEnter={() => handleMouseEnter(track.id)}
                onMouseLeave={handleMouseLeave}
                className="group/card relative flex-none w-[260px] sm:w-[320px] lg:w-[360px] bg-[#181818] rounded-md overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:z-20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/5 hover:border-zinc-700"
              >
                {/* 16:9 Thumbnail Image */}
                <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {hoveredCardId === track.id && (
                    <video
                      src={track.url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover object-center animate-fadeIn z-10"
                    />
                  )}

                  {/* Gradient Vignette over image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30" />

                  {/* Top Badges: N Series & Duration */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="w-4 h-5 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[10px] shadow">
                      N
                    </span>
                    <span className="bg-black/70 backdrop-blur-sm text-zinc-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10">
                      {track.durationLabel}
                    </span>
                  </div>

                  {/* Top Right: Match Score */}
                  <div className="absolute top-2.5 right-2.5 z-20">
                    <span className="bg-black/80 backdrop-blur-sm text-[#46d369] font-bold text-[11px] px-2 py-0.5 rounded-full border border-green-500/20">
                      {track.matchScore}% Match
                    </span>
                  </div>

                  {/* Category Badges */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-20">
                    {track.isVideo ? (
                      <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border border-blue-400/30 uppercase shadow">
                        VIDEO
                      </span>
                    ) : (
                      <span className="bg-[#E50914]/90 backdrop-blur-sm text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border border-[#E50914]/50 uppercase shadow">
                        DJ MIX
                      </span>
                    )}
                    {track.isTrending && (
                      <span className="bg-amber-500/90 backdrop-blur-sm text-black text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border border-amber-300/50 uppercase shadow">
                        EXCLUSIVE
                      </span>
                    )}
                  </div>

                  {/* Bottom Progress Bar (Netflix Resume Style) */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 z-20">
                    <div
                      className="h-full bg-[#E50914]"
                      style={{
                        width: isThisTrackPlaying && duration > 0 ? \`\${(currentTime / duration) * 100}%\` : \`\${(index + 1) * 23}%\`
                      }}
                    />
                  </div>
                </div>

                {/* Card Details & Hover Action Bar */}
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="font-bold text-white text-sm truncate mb-1" title={track.title}>
                      {track.title}
                    </h3>
                    {/* Artist */}
                    <p className="text-zinc-400 text-xs font-medium truncate mb-2">
                      {track.artist}
                    </p>
                    {/* Metadata line */}
                    <div className="flex items-center flex-wrap gap-2 text-[10px] font-mono text-zinc-400 mb-2">
                      <span className="border border-zinc-700 px-1 rounded">{track.ageRating}</span>
                      <span>{track.year}</span>
                      <span className="text-[#46d369] font-bold">LOSSLESS 320K</span>
                    </div>
                    <div className="mb-3">
                      <StarRating trackId={track.id} size="sm" readonly={true} showCount={false} />
                    </div>
                    {/* Genre Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {track.genres.slice(0, 3).map((genre, gIdx) => (
                        <span
                          key={gIdx}
                          className="text-[10px] text-zinc-300 bg-white/5 px-2 py-0.5 rounded"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Netflix Quick Action Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      {/* Play Button */}
                      <button
                        type="button"
                        onClick={() => playTrack(index)}
                        title={isThisTrackPlaying ? 'Pause' : 'Play Now'}
                        className={\`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer \${
                          isThisTrackPlaying
                            ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/40'
                            : 'bg-white text-black hover:bg-white/80'
                        }\`}
                      >
                        {isThisTrackPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                      </button>
                      {/* Download Direct to Phone Button */}
                      <a
                        href={track.downloadUrl}
                        download={track.filename}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          downloadTrack(track);
                        }}
                        title="Download Nonstop to Phone"
                        className="w-8 h-8 rounded-full border border-zinc-600 bg-zinc-800/80 hover:border-white hover:bg-zinc-700 flex items-center justify-center text-white transition-all cursor-pointer group/dl"
                      >
                        <Download className="w-3.5 h-3.5 group-hover/dl:text-[#E50914] transition-colors" />
                      </a>
                      {/* Add to My List */}
                      <button
                        type="button"
                        onClick={(e) => toggleMyList(track.id, e)}
                        title={inMyList ? 'In My List' : 'Add to My List'}
                        className="w-8 h-8 rounded-full border border-zinc-600 bg-zinc-800/80 hover:border-white hover:bg-zinc-700 flex items-center justify-center text-white transition-all cursor-pointer"
                      >
                        {inMyList ? <Check className="w-3.5 h-3.5 text-[#46d369]" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                      {/* Heart Like Button */}
                      <HeartLikeButton trackId={track.id} />
                    </div>
                    {/* More Details Button */}
                    <button
                      type="button"
                      onClick={() => onOpenModal(track)}
                      title="More details & tracklist"
                      className="w-8 h-8 rounded-full border border-zinc-600 bg-zinc-800/80 hover:border-white hover:bg-zinc-700 flex items-center justify-center text-white transition-all cursor-pointer ml-auto"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}`;

const replacementStr = `          {tracks.map((track, index) => {
            const isThisTrackPlaying = isPlaying && currentTrackIndex === index;
            const inMyList = myList.includes(track.id);
            return (
              <LazyTrackCard
                key={track.id}
                track={track}
                index={index}
                isThisTrackPlaying={isThisTrackPlaying}
                inMyList={inMyList}
                hoveredCardId={hoveredCardId}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                onOpenModal={onOpenModal}
                toggleMyList={toggleMyList}
                currentTrackIndex={currentTrackIndex}
                isPlaying={isPlaying}
                playTrack={playTrack}
                downloadTrack={downloadTrack}
                duration={duration}
                currentTime={currentTime}
              />
            );
          })}`;

const newContent = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/NetflixRow.tsx', newContent);
