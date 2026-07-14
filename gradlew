#!/bin/sh

#
# Resolve links - $0 may be a softlink
#
PRG="$0"

while [ -h "$PRG" ] ; do
  ls=`ls -ld "$PRG"`
  link=`expr "$ls" : '.*-> \(.*\)$'`
  if expr "$link" : '/.*' > /dev/null; then
    PRG="$link"
  else
    PRG=`dirname "$PRG"`/"$link"
  fi
done

SAVED="`pwd`"
cd "`dirname \"$PRG\"`" >/dev/null
APP_HOVER="`pwd`"
cd "$SAVED" >/dev/null

# Determine the Java command to use to start the JVM.
if [ -n "$JAVA_HOME" ] ; then
    if [ -x "$JAVA_HOME/bin/java" ] ; then
        # Some JVMs will NOT use JAVA_HOME in preference to their own system properties
        JAVACMD="$JAVA_HOME/bin/java"
    else
        JAVACMD="java"
    fi
else
    JAVACMD="java"
fi

exec "$JAVACMD" -jar "$APP_HOVER/gradle/wrapper/gradle-wrapper.jar" "$@"
